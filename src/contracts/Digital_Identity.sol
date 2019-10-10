pragma solidity ^0.5.0;

contract Digital_Identity {
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

  function createIdentity(string memory _name, uint _age) public {
    require(bytes(_name).length > 0, 'Invalid name');
    require(_age > 0, 'Invalid age');
    identityCount++;
    identities[identityCount] = Identity(identityCount, _name, _age, msg.sender, true);
    emit IdCreated(identityCount, _name, _age, msg.sender, true);
  }

  function retrieveIdentity(uint _id) public {
    Identity memory _identity = identities[_id];
    //address _owner = _identity.owner;
    require(_identity.id > 0 && _identity.id <= identityCount, 'Invalid product ID');
    emit IdRetrieved(_identity.id, _identity.name, _identity.age, _identity.owner, _identity.verified);
  }
}