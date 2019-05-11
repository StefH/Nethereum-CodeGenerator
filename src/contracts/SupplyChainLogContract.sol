pragma solidity ^0.5.2;


import "./OrderContract.sol";


contract SupplyChainLogContract is OrderContract {

    // Constructor
    constructor () public {
        owner = msg.sender;
    }
}