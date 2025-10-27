//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GoofyGoober is ERC20 {
    uint constant _initial_supply = 100 * (10**18);
    
    // Multisig variables
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public requiredSignatures;
    
    struct Transaction {
        address to;
        uint256 amount;
        bool executed;
        uint256 confirmations;
    }
    
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    uint256 public transactionCount;
    
    // Events
    event TransactionSubmitted(uint256 indexed txId, address indexed submitter, address to, uint256 amount);
    event TransactionConfirmed(uint256 indexed txId, address indexed owner);
    event TransactionExecuted(uint256 indexed txId);
    
    // Modifiers
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }
    
    modifier txExists(uint256 txId) {
        require(txId < transactionCount, "Transaction does not exist");
        _;
    }
    
    modifier notExecuted(uint256 txId) {
        require(!transactions[txId].executed, "Transaction already executed");
        _;
    }
    
    modifier notConfirmed(uint256 txId) {
        require(!confirmations[txId][msg.sender], "Transaction already confirmed");
        _;
    }
    
    constructor(address[] memory _owners, uint256 _requiredSignatures) 
        ERC20("GoofyGoober", "GG") 
    {
        require(_owners.length > 0, "Owners required");
        require(
            _requiredSignatures > 0 && _requiredSignatures <= _owners.length,
            "Invalid required signatures"
        );
        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        requiredSignatures = _requiredSignatures;
        _mint(msg.sender, _initial_supply);
    }
    
    // Submit a new mint transaction
    function submitMintTransaction(address to, uint256 amount) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 txId = transactionCount;
        transactions[txId] = Transaction({
            to: to,
            amount: amount,
            executed: false,
            confirmations: 0
        });
        transactionCount++;
        
        emit TransactionSubmitted(txId, msg.sender, to, amount);
        confirmTransaction(txId);
        
        return txId;
    }
    
    // Confirm a pending transaction
    function confirmTransaction(uint256 txId) 
        public 
        onlyOwner 
        txExists(txId) 
        notExecuted(txId)
        notConfirmed(txId)
    {
        confirmations[txId][msg.sender] = true;
        transactions[txId].confirmations++;
        
        emit TransactionConfirmed(txId, msg.sender);
        
        if (transactions[txId].confirmations >= requiredSignatures) {
            executeTransaction(txId);
        }
    }
    
    // Execute a transaction after enough confirmations
    function executeTransaction(uint256 txId) 
        internal 
        txExists(txId) 
        notExecuted(txId) 
    {
        Transaction storage transaction = transactions[txId];
        require(
            transaction.confirmations >= requiredSignatures,
            "Not enough confirmations"
        );
        
        transaction.executed = true;
        _mint(transaction.to, transaction.amount);
        
        emit TransactionExecuted(txId);
    }
    
    // View functions
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
    
    function getTransaction(uint256 txId) 
        public 
        view 
        returns (
            address to,
            uint256 amount,
            bool executed,
            uint256 confirmationCount
        ) 
    {
        Transaction storage transaction = transactions[txId];
        return (
            transaction.to,
            transaction.amount,
            transaction.executed,
            transaction.confirmations
        );
    }
    
    function isConfirmed(uint256 txId, address owner) 
        public 
        view 
        returns (bool) 
    {
        return confirmations[txId][owner];
    }
}
