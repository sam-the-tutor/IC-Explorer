// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type Account = { owner : Principal; subaccount : ?Blob };
  public type Approve = {
    fee : ?Nat;
    from : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Nat;
    expected_allowance : ?Nat;
    expires_at : ?Nat64;
    spender : Account;
  };
  public type Burn = {
    from : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Nat;
    spender : ?Account;
  };
  public type GetAccountTransactionsArgs = {
    max_results : Nat;
    start : ?TxId;
    account : Account;
  };
  public type GetTransactions = {
    transactions : [TransactionWithId];
    oldest_tx_id : ?TxId;
  };
  public type GetTransactionsErr = { message : Text };
  public type GetTransactionsResult = {
    #Ok : GetTransactions;
    #Err : GetTransactionsErr;
  };
  public type InitArgs = { ledger_id : Principal };
  public type ListSubaccountsArgs = { owner : Principal; start : ?SubAccount };
  public type Mint = {
    to : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Nat;
  };
  public type SubAccount = Blob;
  public type Transaction = {
    burn : ?Burn;
    kind : Text;
    mint : ?Mint;
    approve : ?Approve;
    timestamp : Nat64;
    transfer : ?Transfer;
  };
  public type TransactionWithId = { id : TxId; transaction : Transaction };
  public type Transfer = {
    to : Account;
    fee : ?Nat;
    from : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Nat;
    spender : ?Account;
  };
  public type TxId = Nat;
  public type Actor =  actor {
    get_account_transactions : shared GetAccountTransactionsArgs -> async GetTransactionsResult;
    ledger_id : shared query () -> async Principal;
    list_subaccounts : shared query ListSubaccountsArgs -> async [SubAccount];
  }
}
