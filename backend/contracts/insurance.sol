// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

contract insurance {
    uint duration;

    address public provider;
    
    constructor (){
        provider = msg.sender; 
    }

    // 只有insurance provider 才有权限
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

    // 如果没有过期，通过require返回，并不花费gas
    // 如果过期，修改duration
    function checkExpired() external returns(bool) {
        require(block.timestamp >= (insuranceRecord[address(this)] + duration), "Check passed, insurance NOT expired");

        // If expired
        insuranceRecord[address(this)] = 0;
        return true;
    }
}