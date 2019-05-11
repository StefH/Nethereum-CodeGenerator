pragma solidity ^0.5.2;


import "./AuthorizationContract.sol";


contract OrderContract is AuthorizationContract {
    mapping (bytes16 => Order) private orders;
    bytes16[] private orderIdentifiers;

    struct Order {
        bytes16 id;
        string name;
        uint index;
    }

    event AddOrderEvent (
        address indexed from,
        bytes16 indexed id,
        string name
    );

    function addOrder(string memory name) public {
        require(bytes(name).length > 0, "Bad Request: 'name' is empty");

        uint currentTime = now; // solhint-disable-line
        bytes32 hashedValue = keccak256(abi.encodePacked(orderIdentifiers.length, name, currentTime));
        bytes16 uuid = bytes16(hashedValue);

        Order storage newOrder = orders[uuid];
        newOrder.id = uuid;
        newOrder.name = name;
        newOrder.index = orderIdentifiers.length;

        orderIdentifiers.push(uuid);

        emit AddOrderEvent(msg.sender, uuid, name);
    }

    function isExistingOrder(bytes16 id) public view returns(bool existing) {
        if (orderIdentifiers.length == 0) {
            return false;
        }

        return orderIdentifiers[orders[id].index] == id;
    }

    function getOrderCount() public view returns (uint count) {
        return orderIdentifiers.length;
    }

    function getOrderIdAtIndex(uint index) public view returns(bytes16 orderId) {
        require(index >= 0, "Bad Request: 'index' should be >= 0");

        return orderIdentifiers[index];
    }

    function getOrderById(bytes16 orderId) public view returns (bytes16 id, string memory name) {
        assert(isExistingOrder(orderId));

        Order storage foundOrder = orders[orderId];

        return (foundOrder.id, foundOrder.name);
    }
}