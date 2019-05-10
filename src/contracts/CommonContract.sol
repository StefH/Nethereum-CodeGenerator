pragma solidity ^0.5.2;


contract CommonContract {
    uint constant internal MINIMUM_TIMESTAMP = 1483228800;  // Must be in 2017

    function stringEquals(string storage value1, string memory value2) internal pure returns (bool) {
        return getHashFromString(value1) == getHashFromString(value2);
    }

    // Compute the Ethereum-SHA-3 hash from a string
    function getHashFromString(string memory value) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(value));
    }
}