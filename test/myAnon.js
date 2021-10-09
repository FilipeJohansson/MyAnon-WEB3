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

      // FAILURE: Image must have hash
      // await myAnon.uploadPost('', 'Post description', {from: author}).should.be.rejected;

      // FAILURE: Post must have description
      await myAnon.uploadPost('Image hash', '', {from: author}).should.be.rejected;
    })

    // Check from struct
    it('lists posts', async () => {
      const post = await myAnon.posts(postCount)
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is not correct')
      assert.equal(post.hash, hash, 'hash is not correct')
      assert.equal(post.description, 'Post Description', 'description is not correct')
      assert.equal(post.tipAmount, '0', 'tip is not correct')
      assert.equal(post.author, author, 'author is not correct')
    })

    it('allows users to tip posts', async () => {
      // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await myAnon.tipPostOwner(postCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')})

      // SUCCESS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is not correct')
      assert.equal(event.hash, hash, 'hash is not correct')
      assert.equal(event.description, 'Post Description', 'description is not correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip is not correct')
      assert.equal(event.author, author, 'author is not correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipPostOwner
      tipPostOwner = web3.utils.toWei('1', 'Ether')
      tipPostOwner = new web3.utils.BN(tipPostOwner)

      const expectedBalance = oldAuthorBalance.add(tipPostOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to tip a post that does not exist
      await myAnon.tipPostOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
  })
})
