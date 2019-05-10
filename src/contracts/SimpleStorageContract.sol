pragma solidity 0.5.2;


contract SimpleStorageContract {
    int private _version;
    string private _description;
    uint private _storedNumber;
    string private _storedString;

    constructor (int version, string memory description) public {
        _version = version;
        _description = description;
    }

    function setNumber(uint value) public {
        if (value < 10) {
            _storedNumber = 1;
        } else {
            _storedNumber = value;
        }
    }

    function getNumber() public view returns (uint) {
        return _storedNumber;
    }

    function setString(string memory value) public {
        _storedString = value;
    }

    function getString() public view returns (string memory) {
        return _storedString;
    }

    function getVersion() public view returns (int version, string memory description) {
        return (_version, _description);
    }
}