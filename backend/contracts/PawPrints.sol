// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
import "./insurance.sol";

contract PawPrints {
    
    address public owner;
    address public insuranceProvider;
    address public hospital; //医院为创建合约的人

    struct MedicalRecord {
        uint ownerId;
        uint petId;
        uint billAmount;
        uint recordId;
        uint hashRecord;
    }

     mapping(uint256 => MedicalRecord) public record;

    event visited();
    event verified();
    event sent();
    event reimbursed();

    enum State {visitedHospital, insuranceProvided, insuranceVerified, reimbursed, invalid}
    State public state;


    constructor() {
        hospital = msg.sender;
    }

    modifier inState(State _state) {
        require(
            state == _state && state!= State.invalid,
            "Invalid or Out of State."
        );
        _;
    }

    modifier onlyOwner(){
        require(
            msg.sender != insuranceProvider && msg.sender != hospital,
            "Only PET OWNER can call this."
        );
        _;
    }
    
    modifier onlyHospital(){
        require(
            msg.sender == hospital,
            "Only HOSPITAL can call this."
        ); 
        _;
    }
    
    modifier onlyInsuranceProvider(){
        require(
            msg.sender == insuranceProvider,
            "Only INSURANCE PROVIDER can call this."
        );
        _;
    }
    
    // Hospital creates new medical record
    // 入参还可以补充
    function   newMedicalRecord  (uint _ownerId, uint _petId, uint _billAmount, uint _recordId, address ownerAddress, uint _hashRecord) 
        public onlyHospital
    {
        emit visited();
        
        owner = ownerAddress;

        MedicalRecord storage newRecord = record[1];
        newRecord.ownerId = _ownerId;
        newRecord.petId = _petId;
        newRecord.billAmount = _billAmount;
        newRecord.recordId = _recordId;
        newRecord.hashRecord = _hashRecord;

        state = State.visitedHospital;
    }

    function setInsurance (address insuranceAddress) 
    public onlyOwner 
    {
        insuranceProvider = insuranceAddress;

        state = State.insuranceProvided;
    }


    // Insurance Provider verifies Pet's insurance and whether owner really go to hospital
    function verify (uint _ownerId, uint _petId, address insuranceAddress, bool overR)
        external onlyInsuranceProvider inState(State.insuranceProvided) returns(bool)
    {
        emit verified();

        if (overR){
            return true;
        }    
        
        //这里是有bug的，需要把insurance.sol分到单独文件
        //正常的话insurance会抛出异常，需要借助
        
        bool manualCheckPass = insurance(insuranceAddress).checkExpired();
        if(manualCheckPass){
            state = State.insuranceVerified;
            return true;
        }
        return false;
    }

    function getMedicalRecord() public view returns (MedicalRecord memory) {
        MedicalRecord memory user = record[1];
        return user;
    }

    // Insurance company return money back to pet owner
    function reimbursement () 
        public 
        onlyInsuranceProvider
        inState(State.insuranceVerified)

    {
        emit reimbursed();

        state = State.reimbursed;
    }
}
