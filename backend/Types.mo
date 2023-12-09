import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";



module{


  public type EthAddress = {
    address : Text;
    nickName : Text;
  };

  public type ICPAddress = {
    address : Text;
    nickName : Text;
  };

  public type User = {
    address : Text;
    publicKey : [Nat8];
    email : Text;
  };
}