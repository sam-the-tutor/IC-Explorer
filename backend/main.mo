import TrieMap "mo:base/TrieMap";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Timer "mo:base/Timer";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Types "Types";
import { recurringTimer; cancelTimer } "mo:base/Timer";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";

import IcpLedgerTypes "INTERFACES/icpLedger.types";
import UniversalTypes "INTERFACES/universal.types";
import MgtCanisterTypes "INTERFACES/mgt_canister.types";
import Oracle "INTERFACES/price_oracle.types";
import IndexLedgerTypes "INTERFACES/indexLedger.types";
import icpIndexTypes "INTERFACES/icpIndex.types";
import Hex "Utils/Hex";

import EthereumAddress "mo:evm-txs/Address";
import EthereumTransaction "mo:evm-txs/Transaction";
import EthereumContext "mo:evm-txs/Context";

import EthereumAU "mo:evm-txs/utils/ArrayUtils";
import EthTypes "./ECDSA/Types";
import IcEcdsaApi "./ECDSA/IcEcdsaApi";

import BTCUtils "./BTC/src/Utils";
import BTCTypes "./BTC/src/Types";
import BTCWallet "./BTC/src/BitcoinWallet";
import BTCAPI "./BTC/src/BitcoinApi";

actor class TokenExplorer(
  eth_network : IcEcdsaApi.Network,
  btc_network : BTCTypes.Network,
) = this {

  let eth_keyName : Text = switch eth_network {
    case (#Localhost) "dfx_test_key";
    case _ "test_key_1";
  };

  let btc_keyName : Text = switch btc_network {
    case (#Regtest) "dfx_test_key";
    case _ "test_key_1";
  };

  let BTCNetwork : BTCTypes.Network = btc_network;
  //Defi Aggregator cainster for fetching icp token data

  type EthAddress = Types.EthAddress;
  type ICPAddress = Types.ICPAddress;

  let icEcdsaApi = IcEcdsaApi.IcEcdsaApi();
  let ecCtx = EthereumContext.allocECMultContext(null);
  let ic : MgtCanisterTypes.IC = actor ("aaaaa-aa");

  type Data = {
    startBlock : Nat;
    latestTxnIndex : Nat;
  };

  let MonitorData = HashMap.HashMap<Principal, Data>(0, Principal.equal, Principal.hash);
  let TimerData = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
  let SubscribersList = HashMap.HashMap<Principal, Text>(0, Principal.equal, Principal.hash);

  var tempHolder : Text = "";

  public func startLedgerMonitor(block : Nat, tokenName : Text) : async Result.Result<Nat, Text> {
    let tokenCanister = getLedgerId(tokenName);
    let id = Principal.fromText(tokenCanister);
    tempHolder := tokenName;
    switch (MonitorData.get(id)) {
      case (null) {
        //initialize the data
        MonitorData.put(
          id,
          {
            startBlock = block;
            latestTxnIndex = 0;
          },
        );
        let kk : Nat = 6;
        // start the timer and save the details in another hashmap
        let timer = recurringTimer(
          #seconds(5),
          monitorLedger,
        );
        return #ok(timer);

      };
      //if there is already a monitor, return for now
      case (?results) {

        let timer = recurringTimer(
          #seconds(5),
          monitorLedger,
        );
        #ok(timer);
      };
    };

  };

  private func monitorLedger() : async () {
    let canisterID = getLedgerId(tempHolder);
    let tokenActor : UniversalTypes.Actor = actor (canisterID);

    switch (MonitorData.get(Principal.fromText(canisterID))) {
      case (?results) {
        var start = results.startBlock;
        let latest = results.latestTxnIndex;
        if (latest > 0) {
          start := latest +1;
        };
        await helperMonitor(canisterID, start, tempHolder, tokenActor);
      };
      case (null) {};
    };
  };

  private func helperMonitor(canID : Text, start : Nat, tokenName : Text, ledgerCanister : UniversalTypes.Actor) : async () {
    Debug.print("fetching new transactions frmom the test canister");
    Debug.print(tokenName);

    let canId = Principal.fromText(canID);
    var response = await ledgerCanister.get_transactions({
      start = start;
      length = 1;
    });
    if (Array.size(response.transactions) > 0) {
      switch (MonitorData.get(canId)) {
        case (?results) {
          MonitorData.put(
            canId,
            {
              startBlock = results.startBlock;
              latestTxnIndex = start;
            },
          )

        };
        case (null) {};
      };
      //   await setTxnIndex(tokenName, start);
      Debug.print("Latest transaction :" #debug_show (start));

      if (response.transactions[0].kind == "transfer") {
        let t = response.transactions[0];
        switch (t.transfer) {
          case (?transfer) {
            let to = transfer.to.owner;
            Debug.print("Feching user details");

            switch (SubscribersList.get(to)) {
              case (?subscriber) {
                Debug.print("Sending an email to the user");
                await sendEmailNotification(subscriber, t, tokenName, to);
              };
              case (null) {};
            };
          };
          case null {
            // No action required if transfer is null
          };
        };
      };
    };
  };

  //send the email to the recipient
  //should include a link referencing the transaction to the sns dashboard
  private func sendEmailNotification(subscriber : Text, transaction : UniversalTypes.Transaction, tokenName : Text, owner : Principal) : async () {
    Debug.print("preparing to send the email");
    var amount = "0";
    var from = "";
    switch (transaction.transfer) {
      case (?transfer) {
        amount := Nat.toText(transfer.amount);
        from := Principal.toText(transfer.from.owner);
      };
      case null {};
    };

    let url = "https://ic-netlify-functions.netlify.app/.netlify/functions/ic_transactions_notify";

    let idempotency_key : Text = generateUUID();
    let request_headers = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key }

    ];

    let requestBodyJson : Text = "{ \"idempotencyKey\": \"" # idempotency_key # "\", \"receieverEmail\": \"" # subscriber # "\", \"tokenName\": \"" # tokenName # "\", \"tokenAmount\": \"" # amount # "\", \"tokenPayer\": \"" # from # "\",\"receiverAccount\": \"" # Principal.toText(owner) # "\"}";
    let requestBodyAsBlob : Blob = Text.encodeUtf8(requestBodyJson);
    let requestBodyAsNat8 : [Nat8] = Blob.toArray(requestBodyAsBlob);

    let http_request : MgtCanisterTypes.HttpRequestArgs = {
      url = url;
      max_response_bytes = null; //optional for request
      headers = request_headers;
      body = ?requestBodyAsNat8;
      method = #post;
      transform = null; //optional for request
    };

    Cycles.add(220_131_200_000); //minimum cycles needed to pass the CI tests. Cycles needed will vary on many things size of http response, subnetc, etc...).
    Debug.print(" sending the email");
    let http_response : MgtCanisterTypes.HttpResponsePayload = await ic.http_request(http_request);

    let response_body : Blob = Blob.fromArray(http_response.body);
    let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };
  };

  func generateUUID() : Text {
    "UUID-123456789";
  };

  //add a newe subscriber to the list
  public func addNewSubscriber(caller : Principal, email : Text) : async Result.Result<Text, Text> {
    SubscribersList.put(caller, email);
    return #ok("subscription added successfully");
  };

  func getLedgerId(token : Text) : Text {

    switch (token) {
      case ("ckBTC") { return "be2us-64aaa-aaaaa-qaabq-cai" };
      case ("CHAT") { return "bkyz2-fmaaa-aaaaa-qaaaq-cai" };
      case (_) { return "be2us-64aaa-aaaaa-qaabq-ca" };
    };

  };

  //function create an ethereum address
  public func createEthAddress(caller : Principal) : async Result.Result<EthTypes.CreateAddressResponse, Text> {
    let derivationPath = [Principal.toBlob(caller)];
    switch (await* EthereumAddress.create(eth_keyName, derivationPath, icEcdsaApi)) {
      case (#err(msg)) {
        return #err(msg);
      };
      case (#ok(res)) {
        return #ok({
          address = res.0;
        });

      };
    };
  };

  /// Returns the P2PKH address of this canister at a specific derivation path.
  public func get_p2pkh_address(caller : Principal) : async BTCTypes.BitcoinAddress {
    let derivationPath = [Blob.toArray(Principal.toBlob(caller))];
    await BTCWallet.get_p2pkh_address(BTCNetwork, btc_keyName, derivationPath);
  };

  //get the bitcoin balance of the user
  /// Returns the balance of the given Bitcoin address.
  public func get_balance(address : BTCTypes.BitcoinAddress) : async BTCTypes.Satoshi {
    await BTCAPI.get_balance(BTCNetwork, address);
  };

};
