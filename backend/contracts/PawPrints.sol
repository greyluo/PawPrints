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

contract PawPrints {
    
    address payable public owner;
    address payable public insuranceProvider;
    address payable public hospital; //医院为创建合约的人

    struct MedicalRecord {
        uint ownerId;
        uint petId;
        uint billAmount;
        uint recordId;
    }

    event visited();
    event verified();
    event sent();
    event reimbursed();

    enum State {visited, verified, sent, reimbursed }
    State public state;


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
    //入参还可以补充
    function newMedicalRecord (uint _ownerId, uint _petId, uint _billAmount, uint _recordId) 
        public
        onlyHospital
    {
        emit visited();
        
        MedicalRecord({
            ownerId: _ownerId,
            petId: _petId,
            billAmount: _billAmount,
            recordId: _recordId});

       //state = state.visited;
    }

    // Insurance Provider verifies Pet's insurance and whether owner really go to hospital
    function verify (uint _ownerId, uint _petId, address insuranceAddress)
        external
        
        returns(bool)
    {
        emit verified();
            
        //需要让保险公司核实owner有没有买保险 + 有没有去医院
        //不知道mapping是否能实现这个功能

        require (insurance(insuranceAddress).checkExpired(), "Invalid Insurance");
        //state = state.verified;
        return true;
    }

    // Hospital sends medical record to insurance company
    function sentRecord()
        public 
        onlyHospital
        onlyInsuranceProvider
    {
        
    }

    // Insurance company return money back to pet owner
    function reimbursement () 
        public 
        onlyInsuranceProvider

    {
        emit reimbursed();

        //state = state.reimbursed;
    }
}