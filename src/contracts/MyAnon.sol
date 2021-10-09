pragma solidity ^0.5.16;

contract MyAnon {
    string public name = "MyAnon";

    // Store posts
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;   
    }

    event PostCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
    );

    // Create posts
    function uploadPost(string memory _imgHash, string memory _description) public {
        // Make sure image hash exists
        require(bytes(_imgHash).length > 0);

        // Make sure description exists
        require(bytes(_description).length > 0);

        // Make suer uploader address exists
        require(msg.sender != address(0x0));

        //Increment post id
        postCount++;

        // Add post to contract
        posts[postCount] = Post(postCount, _imgHash, _description, 0, msg.sender);

        // Trigger an event
        emit PostCreated(postCount, _imgHash, _description, 0, msg.sender);
    }

    // Tip posts
    function tipPostOwner(uint _id) public payable {
        // Make sue the id is valid
        require(_id > 0 && _id <= postCount);

        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Incement the tip amount
        _post.tipAmount += msg.value;
        // Update the post
        post[_id] = _post;

        // Trigger an event
        emit PostTipped(_id, _post.hash, _post.description, _post.tipAmount, _author);
    }

}
