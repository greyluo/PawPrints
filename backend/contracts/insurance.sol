// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

contract insurance {
    uint duration;

    address public provider;
    
    constructor (){
        provider = msg.sender; 
    }

    modifier onlyProvider(){
        require(
            msg.sender == provider,
            "only SELLER can call this."
        );
        _;
    }

    mapping(address => uint) insuranceRecord;

    function updateStatus (uint _duration) 
    public onlyProvider returns (address){
        duration = _duration;
        insuranceRecord[address(this)] = block.timestamp;
        return address(this);
    }


    // If not expired, using require to return without spending gas
    // If expired, it will set the duration to 0
    function checkExpired() external returns(bool) {
        require(block.timestamp >= (insuranceRecord[address(this)] + duration), "Check passed, insurance NOT expired");

        // If expired
        insuranceRecord[address(this)] = 0;
        return true;
    }
}