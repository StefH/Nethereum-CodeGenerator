pragma solidity ^0.5.2;


import "./CommonContract.sol";


contract AuthorizationContract is CommonContract {
    address internal owner;

    // The function body is inserted where the special symbol "_;" in the definition of a modifier appears.
    // This means that if the owner calls this function, the function is executed and otherwise, an exception is thrown.
    modifier onlyContractUploader() {
        require(msg.sender == owner);
        _;
    }
}