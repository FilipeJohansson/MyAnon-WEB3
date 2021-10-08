const MyAnon = artifacts.require("./MyAnon.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("MyAnon", ([deployer, author, tipper]) => {
  let myAnon

  before(async () => {
    myAnon = await MyAnon.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await myAnon.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await myAnon.name()
      assert.equal(name, 'MyAnon')
    })
  })

  describe('posts', () => {
    let result

    it('creates posts', async () => {
      result = await myAnon.uploadPost();
      let post = await myAnon.posts(1);
      console.log(post);
    })
  })
  
})
