const { assert } = require('chai');

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
    const hash = 'abc'

    before(async () => {
      result = await myAnon.uploadPost(hash, 'Post Description', {from: author})
      postCount = await myAnon.postCount();
    })

    it('creates posts', async () => {
      // SUCCESS
      assert.equal(postCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is not correct')
      assert.equal(event.hash, hash, 'hash is not correct')
      assert.equal(event.description, 'Post Description', 'description is not correct')
      assert.equal(event.tipAmount, '0', 'tip is not correct')
      assert.equal(event.author, author, 'author is not correct')
    })
  })
  
})
