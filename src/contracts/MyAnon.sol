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

    // Create posts
    function uploadPost(string memory _postHash, string memory _description) public {
        // Make sure description exists
        require(bytes(_description).length > 0);

        // Make suer uploader address exists
        require(msg.sender != address(0x0));

        //Increment post id
        postCount++;

        // Add post to contract
        posts[postCount] = Post(postCount, _postHash, _description, 0, msg.sender);

        // Trigger an event
        emit PostCreated(postCount, _postHash, _description, 0, msg.sender);
    }

    // Tip posts

}
