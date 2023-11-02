// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract MyContract {
    mapping(address => string) public names;

    function introduce(string memory name) external {
        names[msg.sender] = name;
    }

    function greet() external view returns(string memory) {
        // NOTE: Get name stored in mapping
        // Step (1) in the accompanying tutorial
        // string memory name = /* ... */;
        string memory name = names[msg.sender];
        return string.concat("Hello future - ", name);
    }
}
