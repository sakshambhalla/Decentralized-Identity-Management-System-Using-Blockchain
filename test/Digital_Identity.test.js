const Digital_Identity = artifacts.require('./Digital_Identity.sol');
require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Digital_Identity', ([user, authority]) => {
  let identity;

  before(async () => {
    identity = await Digital_Identity.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await identity.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has name', async () => {
      const name = await identity.name();
      assert.equal(name, 'Digital Identity Blockchain');
    });
  });

  describe('identity', async () => {
    let CA = "QmYokvq4GYMFAHWxzj4aYQ7tAn6FnNNWM4iMfEE1b7TECd";
    let result, id;
    before(async () => {
      result = await identity.createIdentity(CA, { from: user });
      id = await identity.identities(user);
    });
    console.log(id);

    it('creates identity', async () => {
  //     // SUCCESS
      assert.equal(id.contentAddress, CA);
      //const event = result.logs[0].args;
  //     assert.equal(event.id.toNumber(), identityCount, 'id is correct');
      //console.log(event.data);
  //     assert.equal(event.age, 21, 'Age is Correct');
  //     assert.equal(event.owner, user, 'Owner is Correct');
  //     assert.equal(event.verified, true, 'Verified is Correct');

  //     // FAILURE
  //     await identity.createIdentity('', 20, { from: user }).should.be.rejected;
  //     await identity.createIdentity('Vinay', 0, { from: user }).should.be.rejected;
    });

  //   it('Retrieved Identity', async () => {
  //     // SUCCESS
  //     const id = await identity.retrieveIdentity(identityCount, { from: authority });
  //     const event = id.logs[0].args;
  //     assert.equal(event.id.toNumber(), identityCount.toNumber(), 'id is correct');
  //     assert.equal(event.name, 'Vinay', 'Name is Correct');
  //     assert.equal(event.age, 21, 'Age is Correct');
  //     assert.equal(event.owner, user, 'Owner is Correct');
  //     assert.equal(event.verified, true, 'Verified is Correct');

  //     // FAILURE
  //     await identity.retrieveIdentity(0, { from: authority }).should.be.rejected;
  //     await identity.retrieveIdentity(99, { from: authority }).should.be.rejected;
  //   })
  });
});