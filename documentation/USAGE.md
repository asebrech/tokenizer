# Usage Guide

Complete guide to interacting with the DontPanic42 token and its multisig features.

## Prerequisites

- Contract deployed on Sepolia (see [DEPLOYMENT.md](DEPLOYMENT.md))
- `CONTRACT_ADDRESS` set in your `.env` file
- Node.js and Hardhat installed

## Standard ERC20 Operations

### Check Token Information

```bash
npx hardhat multisig:info --network sepolia
```

Output:

```
--- Contract Information ---
Name: DontPanic42
Symbol: PANIC
Total Supply: 42000.0 PANIC
Required Signatures: 2
Total Transactions: 0
```

### View All Owners

```bash
npx hardhat multisig:owners --network sepolia
```

Output:

```
--- Multisig Owners ---
Required Signatures: 2 out of 2

Owners:
  1. 0x1234...
  2. 0x5678...
```

### Check Token Balance

```bash
npx hardhat multisig:balance --address 0xYourAddress --network sepolia
```

Output:

```
--- Token Balance ---
Address: 0xYourAddress
Balance: 42000.0 PANIC
```

## Multisig Minting Process

The multisig system requires multiple owners to approve any minting operation. Here's the complete workflow:

### Step 1: Submit a Mint Proposal

Any owner can submit a proposal to mint new tokens:

```bash
npx hardhat multisig:submit \
  --to 0xRecipientAddress \
  --amount 100 \
  --network sepolia
```

Output:

```
--- Submitting Mint Transaction ---
Recipient: 0xRecipientAddress
Amount: 100 tokens

✓ Transaction submitted!
Transaction ID: 0
Confirmations: 1
Required: 2
⏳ Waiting for more signatures...
```

**What happens:**

- A new transaction proposal is created
- The submitter automatically confirms it
- Transaction gets a unique ID (starting from 0)
- Other owners must now confirm

### Step 2: Other Owners Confirm

Each remaining owner must confirm the transaction using their private key:

```bash
npx hardhat multisig:confirm-as \
  --txid 0 \
  --key PRIVATE_KEY_OF_SECOND_OWNER \
  --network sepolia
```

**Security Note:** Never share private keys. Each owner should run this command with their own key.

Output after final confirmation:

```
--- Confirming Transaction ---
Transaction ID: 0

✓ Transaction confirmed!
✓ Transaction executed successfully!

--- Mint Details ---
Recipient: 0xRecipientAddress
Amount: 100 tokens
New Total Supply: 42100 PANIC
```

**What happens:**

- Owner confirms the transaction
- When threshold is reached (all owners confirmed), it auto-executes
- Tokens are minted to the recipient
- Transaction is marked as executed

### Step 3: View Transaction Details

Check the status of any transaction:

```bash
npx hardhat multisig:tx --txid 0 --network sepolia
```

Output:

```
--- Transaction Details ---
Transaction ID: 0
Recipient: 0xRecipientAddress
Amount: 100.0 tokens
Executed: true
Confirmations: 2 / 2
```

## Complete Example Workflow

Let's mint 1000 tokens to address `0xABC...`:

```bash
# 1. First owner submits the proposal
npx hardhat multisig:submit --to 0xABC... --amount 1000 --network sepolia
# Output: Transaction ID: 0, Confirmations: 1/2

# 2. Second owner confirms (or any remaining owners)
npx hardhat multisig:confirm-as --txid 0 --key OWNER2_PRIVATE_KEY --network sepolia
# Output: ✓ Transaction executed! 1000 tokens minted.

# 3. Verify the balance
npx hardhat multisig:balance --address 0xABC... --network sepolia
# Output: Balance: 1000.0 PANIC

# 4. Check total supply
npx hardhat multisig:info --network sepolia
# Output: Total Supply: 43000.0 PANIC
```

## Using MetaMask or Other Wallets

You can also interact with the token using MetaMask:

### Add Token to MetaMask

1. Open MetaMask and switch to Sepolia Testnet
2. Click "Import Tokens"
3. Enter the contract address: `0xD1D920D8A8BA0F148e46fdbB7271Cfc9aA8e230a`
4. Token symbol and decimals should auto-populate
5. Click "Add Custom Token"

### Transfer Tokens

Once added, you can:

- View your PANIC token balance
- Send tokens to other addresses
- See transaction history

**Note:** Only the initial supply can be transferred. New tokens can only be minted via multisig.

## Available Hardhat Tasks

| Task                  | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `multisig:info`       | Display contract information (name, symbol, supply, etc.) |
| `multisig:owners`     | List all multisig owners and signature requirements       |
| `multisig:submit`     | Submit a new mint transaction proposal                    |
| `multisig:confirm-as` | Confirm a transaction with a specific private key         |
| `multisig:tx`         | View detailed information about a transaction             |
| `multisig:balance`    | Check PANIC token balance of an address                   |

All tasks support the `--network sepolia` flag.

## Security Best Practices

### For Token Holders

- ✅ Verify the contract address before adding to wallet
- ✅ Only interact with the official contract
- ✅ Double-check recipient addresses before transfers

### For Multisig Owners

- ✅ Keep private keys secure and offline when possible
- ✅ Verify transaction details before confirming
- ✅ Never share your private key with anyone
- ✅ Use hardware wallets for production deployments
- ❌ Never confirm transactions you didn't review
- ❌ Never run commands from untrusted sources
