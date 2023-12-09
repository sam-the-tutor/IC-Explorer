import Types "./Types";
import HashMap "mo:base/HashMap";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";

actor class Users() = this {

  // access control will be added after the mvp testing is done and only the main canister should be abblowed to access theses functions

  public type EthAddress = Types.EthAddress;
  public type ICPAddress = Types.ICPAddress;
  public type User = Types.User;

  //store users and their address
  private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  //triemap to store secondary ethereum addresses that the user supplies.
  private var ethAddresses = TrieMap.TrieMap<Principal, List.List<EthAddress>>(Principal.equal, Principal.hash);

  //triemap to store secondary icp addresses that the user supplies.
  private var icpAddresses = TrieMap.TrieMap<Principal, List.List<ICPAddress>>(Principal.equal, Principal.hash);

  private stable var usersArray : [(Principal, User)] = [];
  private stable var ethAddressesArray : [(Principal, [EthAddress])] = [];
  private stable var icpAddressesArray : [(Principal, [ICPAddress])] = [];

  //add icp secondary address
  public func addicpaddress(caller : Principal, _nickName : Text, addr : Text) : async Result.Result<EthAddress, Text> {
    switch (icpAddresses.get(caller)) {
      case (null) {
        let newAddr = {
          address = addr;
          nickName = _nickName;
        };
        var list = List.nil<ICPAddress>();
        list := List.push<ICPAddress>(newAddr, list);
        icpAddresses.put(caller, list);
        return #ok(newAddr);
      };
      case (?value) {
        var list = value;
        let newAddr = {
          address = addr;
          nickName = _nickName;
        };
        list := List.push<ICPAddress>(newAddr, list);
        icpAddresses.put(caller, list);
        return #ok(newAddr);
      };
    };

  };

  //delete a secondary address from the list
  public func deleteicpadress(caller : Principal, addr : Text) : async Result.Result<Text, Text> {

    switch (icpAddresses.get(caller)) {
      case null return #err("No addresses found");
      case (?value) {
        let newList = List.filter<ICPAddress>(value, func val { val.address != addr });
        icpAddresses.put(caller, newList);
        return #ok("Address deleted successfully");
      };
    };
  };

  //get all user icp secondary addresses
  public query func getallusericpaddresses(user : Principal) : async Result.Result<[ICPAddress], Text> {
    switch (icpAddresses.get(user)) {
      case (null) {

        return #ok([{
          address = Principal.toText(user);
          nickName = "Primary";
        }]);
      };
      case (?list) {
        var tempList = list;
        tempList := List.push<EthAddress>(
          {
            address = Principal.toText(user);
            nickName = "Primary";
          },
          tempList,
        );
        return #ok(List.toArray<EthAddress>(tempList));
      };
    };

  };

  //add new seondary ethereum address
  public func addethaddress(caller : Principal, _nickName : Text, addr : Text) : async Result.Result<EthAddress, Text> {

    switch (ethAddresses.get(caller)) {
      case (null) {
        let newAddr = {
          address = addr;
          nickName = _nickName;
        };
        var list = List.nil<EthAddress>();
        list := List.push<EthAddress>(newAddr, list);
        ethAddresses.put(caller, list);
        return #ok(newAddr);
      };
      case (?value) {
        var list = value;
        let newAddr = {
          address = addr;
          nickName = _nickName;
        };
        list := List.push<EthAddress>(newAddr, list);
        ethAddresses.put(caller, list);
        return #ok(newAddr);
      };
    };

  };

  //delete a secondary address from the list
  public shared func deleteethadress(caller : Principal, addr : Text) : async Result.Result<Text, Text> {

    switch (ethAddresses.get(caller)) {
      case null return #err("No addresses found");
      case (?value) {
        let newList = List.filter<EthAddress>(value, func val { val.address != addr });
        ethAddresses.put(caller, newList);
        return #ok("Address deleted successfully");
      };
    };
  };

  //store user information
  public func storeuseremail(caller : Principal, email : Text) : async Result.Result<(), Text> {
    try {
      switch (users.get(caller)) {
        case (null) {
          users.put(
            caller,
            {
              address = "";
              publicKey = [];
              email = email;
            },
          );
          return #ok();
        };
        case (?user) {
          users.put(
            caller,
            {
              address = user.address;
              publicKey = user.publicKey;
              email = email;
            },
          );
          return #ok();
        };
      };
    } catch (error) {
      return #err(Error.message(error));
    };
  };

  public func storePubKey(caller : Principal, _address : Text, _publicKey : [Nat8]) : async Result.Result<(), Text> {
    try {
      users.put(
        caller,
        {
          address = _address;
          publicKey = _publicKey;
          email = "";
        },
      );
      return #ok();

    } catch (error) {
      return #err(Error.message(error));
    };
  };

  //get all user addresses
  public query func allethddresses(user : Principal) : async Result.Result<[EthAddress], Text> {
    switch (ethAddresses.get(user)) {
      case (null) {
        //check to see if the user has created the eth address and return it.
        switch (users.get(user)) {
          case (null) { return #err("Error in getting user") };
          case (?value) {
            if (not (Text.equal(value.address, ""))) {
              return #ok([{
                address = value.address;
                nickName = "Primary";
              }]);
            } else {
              return #err("Create an eth wallet address to continue");
            };
          };
        };
      };
      case (?list) {
        var tempList = list;

        switch (users.get(user)) {
          case (null) { return #err("Error in getting user") };
          case (?value) {
            if (not (Text.equal(value.address, ""))) {
              tempList := List.push<EthAddress>(
                {
                  address = value.address;
                  nickName = "Primary";
                },
                tempList,
              );
            };
          };
        };
        return #ok(List.toArray<EthAddress>(tempList));
      };
    };
  };

  //get user's info, contains the user email, password,deviceCode eth address
  public query func useracc(user : Principal) : async Result.Result<User, Text> {
    switch (users.get(user)) {
      case null return #err("No user eth account found");
      case (?account) { return #ok(account) };
    };

  };

  //backup the data before any upgrade
  system func preupgrade() {
    usersArray := Iter.toArray(users.entries());
    let (eth, icp) = transformTrieMaps();
    ethAddressesArray := eth;
    icpAddressesArray := icp;
  };

  system func postupgrade() {
    var ethTemp = TrieMap.TrieMap<Principal, List.List<EthAddress>>(Principal.equal, Principal.hash);
    var icpTemp = TrieMap.TrieMap<Principal, List.List<EthAddress>>(Principal.equal, Principal.hash);

    let (eth, icp) = transformArray();

    for ((userPrincipal, addressList) in eth.vals()) {
      ethTemp.put((userPrincipal, addressList));
    };
    for ((userPrincipal, addressList) in icp.vals()) {
      icpTemp.put((userPrincipal, addressList));
    };

    ethAddresses := ethTemp;
    icpAddresses := icpTemp;
  };

  private func transformTrieMaps() : ([(Principal, [EthAddress])], [(Principal, [ICPAddress])]) {
    var ethData = Buffer.Buffer<(Principal, [EthAddress])>(0);
    var icpData = Buffer.Buffer<(Principal, [ICPAddress])>(0);
    for ((key, addressList) in ethAddresses.entries()) {
      ethData.add((key, List.toArray<EthAddress>(addressList)));
    };

    for ((key, addressList) in icpAddresses.entries()) {
      icpData.add((key, List.toArray<ICPAddress>(addressList)));
    };

    return (Buffer.toArray<(Principal, [EthAddress])>(ethData), Buffer.toArray<(Principal, [ICPAddress])>(icpData));
  };

  private func transformArray() : ([(Principal, List.List<EthAddress>)], [(Principal, List.List<EthAddress>)]) {
    var ethBuffer = Buffer.Buffer<(Principal, List.List<EthAddress>)>(0);
    var icpBuffer = Buffer.Buffer<(Principal, List.List<EthAddress>)>(0);

    for ((userPrincipal, addressList) in ethAddressesArray.vals()) {
      ethBuffer.add((userPrincipal, List.fromArray<EthAddress>(addressList)));
    };

    for ((userPrincipal, addressList) in icpAddressesArray.vals()) {
      icpBuffer.add((userPrincipal, List.fromArray<EthAddress>(addressList)));
    };

    return (Buffer.toArray<(Principal, List.List<EthAddress>)>(ethBuffer), Buffer.toArray<(Principal, List.List<ICPAddress>)>(icpBuffer));
  };

};
