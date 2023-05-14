pragma solidity ^0.8.0;

contract insurance {
    uint duration;

    address payable public seller;
    
    modifier onlySeller(){
        require(
            msg.sender == seller,
            "only SELLER can call this."
        );
        _;
    }

    mapping(address => uint) insuranceRecord;

    function buyInsurance (uint _duration) public returns (address){
        duration = _duration;
        insuranceRecord[address(this)] = block.timestamp;
        return address(this);
    }

    function checkExpired() external returns(bool) {
        require(block.timestamp <= (insuranceRecord[address(this)] + duration), "The insurance is expired");
        insuranceRecord[address(this)] = 0;
        return true;
    }
}