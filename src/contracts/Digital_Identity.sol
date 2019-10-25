pragma solidity ^0.5.0;

contract Digital_Identity {
  string public name = "Digital Identity Blockchain";
  uint public identityCount = 0;
  mapping(uint => Identity) public identities;

  struct Identity {
    uint id;
    string name;
    uint age;
    address owner;
    bool verified;
  }

  event IdCreated(
    uint id,
    string name,
    uint age,
    address owner,
    bool verified
  );

  event IdRetrieved(
    uint id,
    string name,
    uint age,
    address owner,
    bool verified
  );

  function createIdentity(string memory _name, uint _age) public returns(uint) {
    require(bytes(_name).length > 0, 'Invalid name');
    require(_age > 0, 'Invalid age');
    identityCount++;
    identities[identityCount] = Identity(identityCount, _name, _age, msg.sender, true);
    emit IdCreated(identityCount, _name, _age, msg.sender, true);
    return identityCount;
  }

  function retrieveIdentity(uint _id) public {
    require(_id > 0 && _id <= identityCount, 'Invalid product ID');
    Identity memory _identity = identities[_id];
    emit IdRetrieved(_identity.id, _identity.name, _identity.age, _identity.owner, _identity.verified);
  }
}