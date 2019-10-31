pragma solidity 0.5.0;
import "./provableAPI.sol";

contract Digital_Identity is usingProvable {
  string public name = "Digital Identity Blockchain";
  mapping(address => Identity) public identities;

  struct Identity {
    address did;
    string contentAddress;
  }

  event Received(string data);

  function createIdentity(string memory _contentAddress) public {
    require(bytes(_contentAddress).length > 0, 'Invalid address');
    //provable_query("IPFS", "QmYokvq4GYMFAHWxzj4aYQ7tAn6FnNNWM4iMfEE1b7TECd");
    identities[msg.sender] = Identity(msg.sender, _contentAddress);
  }

  // function retrieveIdentity(uint _id) public {
  //   require(_id > 0 && _id <= identityCount, 'Invalid product ID');
  //   //Identity memory _identity = identities[_id];
  // }
}