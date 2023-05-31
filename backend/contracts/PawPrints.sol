// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
import "./insurance.sol";

contract PawPrints {
    
    address public owner;
    address public insuranceProvider;
    address public hospital; 

    struct MedicalRecord {
        uint ownerId;
        uint petId;
        uint billAmount;
        uint recordId;
        bytes32 hashRecord;
    }

     mapping(uint256 => MedicalRecord) public record;
    
    enum State {deployed, 
                visitedHospital, 
                insuranceProvided, 
                insuranceVerified, 
                reimbursed, 
                invalid}
    State public state;

    event recordCreated(string message, 
                        uint ownerId,
                        uint petId,
                        uint billAmount,
                        uint recordId,
                        bytes32 hashRecord);

    // Hospital will be the one deploying the contract
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
    function   newMedicalRecord  (uint _ownerId, 
                                uint _petId, 
                                uint _billAmount, 
                                uint _recordId, 
                                address ownerAddress, 
                                bytes32 _hashRecord) 
        public onlyHospital inState(State.deployed)
    {
        
        // Hospital set the address of owner
        owner = ownerAddress;

        // Store record on chain
        MedicalRecord storage newRecord = record[1];
        newRecord.ownerId = _ownerId;
        newRecord.petId = _petId;
        newRecord.billAmount = _billAmount;
        newRecord.recordId = _recordId;
        newRecord.hashRecord = _hashRecord;

        state = State.visitedHospital;

        emit recordCreated("Record Created",
                            _ownerId,
                            _petId,
                            _billAmount,
                            _recordId,
                            _hashRecord);
    }

    function setInsurance (address insuranceAddress) 
    public onlyOwner 
    {
        insuranceProvider = insuranceAddress;

        state = State.insuranceProvided;
    }


    // Insurance Provider verifies Pet's insurance and whether owner really go to hospital
    function verify (address insuranceAddress, bool overR)
        external onlyInsuranceProvider inState(State.insuranceProvided) returns(bool)
    {
        // Verification result from 3rd party insurance company
        if (overR){
            state = State.insuranceVerified;
            return true;
        }    
        
        // Auto verifiation using side-contract insurance.sol
        bool manualCheckPass = insurance(insuranceAddress).checkExpired();
        if(manualCheckPass){
            state = State.insuranceVerified;
            return true;
        }
        return false;
    }

    function getState() public view returns (State) {
        return state;
    } 

    function getMedicalRecord() public view returns (MedicalRecord memory) {
        MedicalRecord memory user = record[1];
        return user;
    }

    // Insurance company return money back to pet owner
    function reimbursement () 
        public onlyInsuranceProvider inState(State.insuranceVerified)
    {
        state = State.reimbursed;
    }
}