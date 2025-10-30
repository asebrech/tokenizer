# Technical Documentation

In-depth technical details about the DontPanic42 token architecture and implementation.

## Architecture Overview

DontPanic42 is an ERC20 token with an integrated multisignature minting system. The contract combines:

- **OpenZeppelin's ERC20**: Battle-tested, audited implementation
- **Custom Multisig Logic**: Secure multi-party approval system for minting

## Smart Contract Structure

### Inheritance

```
DontPanic42
    └── ERC20 (OpenZeppelin)
        └── IERC20
        └── IERC20Metadata
```

### State Variables

#### Token Configuration

```solidity
uint constant _initial_supply = 42000 * (10**18);  // 42,000 tokens
```

#### Multisig Configuration

```solidity
address[] public owners;                            // List of authorized owners
mapping(address => bool) public isOwner;            // Quick owner lookup
uint256 public requiredSignatures;                  // Number of required approvals
```

#### Transaction Management

```solidity
mapping(uint256 => Transaction) public transactions;           // Transaction storage
mapping(uint256 => mapping(address => bool)) public confirmations;  // Confirmation tracking
uint256 public transactionCount;                               // Transaction counter
```

### Transaction Structure

```solidity
struct Transaction {
    address to;              // Recipient address
    uint256 amount;          // Amount to mint
    bool executed;           // Execution status
    uint256 confirmations;   // Current confirmation count
}
```

## Core Functions

### Constructor

```solidity
constructor(address[] memory _owners, uint256 _requiredSignatures)
```

**Purpose:** Initialize the token with multisig configuration

**Parameters:**

- `_owners`: Array of owner addresses
- `_requiredSignatures`: Number of required approvals (must be ≤ number of owners)

**Actions:**

1. Validates owners (non-zero, unique addresses)
2. Sets up multisig configuration
3. Mints initial supply to deployer
4. Initializes ERC20 with name "DontPanic42" and symbol "PANIC"

### submitMintTransaction

```solidity
function submitMintTransaction(address to, uint256 amount)
    public
    onlyOwner
    returns (uint256)
```

**Purpose:** Create a new mint proposal

**Access:** Only multisig owners

**Process:**

1. Validates recipient and amount
2. Creates new transaction with unique ID
3. Automatically confirms from submitter
4. Emits `TransactionSubmitted` event
5. Auto-executes if threshold reached

**Returns:** Transaction ID

### confirmTransaction

```solidity
function confirmTransaction(uint256 txId)
    public
    onlyOwner
    txExists(txId)
    notExecuted(txId)
    notConfirmed(txId)
```

**Purpose:** Approve a pending mint transaction

**Access:** Only multisig owners who haven't confirmed yet

**Process:**

1. Validates transaction exists and is pending
2. Records confirmation from caller
3. Increments confirmation count
4. Emits `TransactionConfirmed` event
5. Auto-executes if threshold reached

### executeTransaction

```solidity
function executeTransaction(uint256 txId) internal
```

**Purpose:** Mint tokens when threshold is reached

**Access:** Internal only (called automatically)

**Process:**

1. Marks transaction as executed
2. Mints tokens to recipient
3. Emits `TransactionExecuted` event

**Security:** Cannot be called directly, only via confirmation flow

### View Functions

#### getOwners

```solidity
function getOwners() public view returns (address[] memory)
```

Returns array of all owner addresses.

#### isConfirmed

```solidity
function isConfirmed(uint256 txId, address owner) public view returns (bool)
```

Checks if specific owner has confirmed a transaction.

#### getTransaction

```solidity
function getTransaction(uint256 txId) public view returns (...)
```

Returns complete transaction details including confirmation count.

#### getConfirmationCount

```solidity
function getConfirmationCount(uint256 txId) public view returns (uint256)
```

Returns number of confirmations for a transaction.

## Security Features

### Access Control

**Modifiers:**

- `onlyOwner`: Restricts functions to multisig owners only
- `txExists`: Ensures transaction ID is valid
- `notExecuted`: Prevents re-execution of completed transactions
- `notConfirmed`: Prevents double-confirmation by same owner

### Validation Checks

1. **Owner Validation:**

   - Non-zero addresses
   - Unique addresses (no duplicates)
   - At least one owner required

2. **Signature Validation:**

   - Required signatures > 0
   - Required signatures ≤ total owners
   - Prevents impossible configurations

3. **Transaction Validation:**
   - Recipient must be non-zero address
   - Amount must be greater than zero
   - Transaction must exist
   - Transaction must not be executed
   - Owner cannot confirm twice

### Automatic Execution

Transactions execute automatically when the confirmation threshold is reached, preventing:

- Forgotten executions
- Race conditions
- Front-running attacks

## Events

### TransactionSubmitted

```solidity
event TransactionSubmitted(
    uint256 indexed txId,
    address indexed submitter,
    address to,
    uint256 amount
);
```

Emitted when a new mint proposal is created.

### TransactionConfirmed

```solidity
event TransactionConfirmed(
    uint256 indexed txId,
    address indexed owner
);
```

Emitted when an owner confirms a transaction.

### TransactionExecuted

```solidity
event TransactionExecuted(uint256 indexed txId);
```

Emitted when a transaction is executed and tokens are minted.

## Gas Optimization

- Uses `indexed` parameters in events for efficient filtering
- Stores confirmation count separately to avoid iteration
- Uses mappings for O(1) lookups
- Minimal storage updates per transaction

## Contract Verification

Verified on Sepolia Etherscan:

- **Address**: `0xD1D920D8A8BA0F148e46fdbB7271Cfc9aA8e230a`
- **Network**: Sepolia Testnet
- **Compiler**: Solidity 0.8.28
- **Optimization**: Enabled
- **Runs**: 200

View source code: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xD1D920D8A8BA0F148e46fdbB7271Cfc9aA8e230a#code)

## License

SPDX-License-Identifier: Unlicense

This contract is provided as-is for educational purposes.
