pragma solidity ^0.5.16;

contract MyAnon {
    string public name = "MyAnon";

    // Store posts
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;   
    }

    // Create posts
    function uploadPost() public {
        posts[1] = Post(1, 'acb', 'Hello', 0, address(0x0));
    }

    // Tip posts

}
