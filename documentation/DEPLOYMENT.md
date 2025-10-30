# Deployment Guide

This guide will walk you through deploying the DontPanic42 token to the Sepolia testnet.

## Prerequisites

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Sepolia ETH

You need Sepolia testnet ETH to deploy the contract. Get free testnet ETH from:

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

### 3. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual values:

```bash
API_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
PRIVATE_KEY="your_wallet_private_key_without_0x"
ETHERSCAN_API_KEY="your_etherscan_api_key"
```

**Important Security Notes:**

- Never commit your `.env` file to version control (it's already in `.gitignore`)
- Never share your private key
- Use a testnet wallet, not your main wallet

### 4. Get API Keys

**Alchemy (RPC Provider)**

1. Go to [alchemy.com](https://www.alchemy.com/)
2. Create a free account
3. Create a new app on Sepolia network
4. Copy the HTTP URL to `API_URL` in `.env`

**Etherscan (for verification)**

1. Go to [etherscan.io](https://etherscan.io/)
2. Create an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy to `ETHERSCAN_API_KEY` in `.env`

## Configuration

### Multisig Owners

Edit `deployment/deploy.js` to set your multisig owners:

```javascript
const owners = [
  deployer.address, // First owner (deployer)
  "0x76FB103D48D7e2719FE2D4470337120498233218", // Second owner
];
```

- The first owner is automatically set to the deployer's address
- Add additional owner addresses as needed
- `requiredSignatures` is automatically set to the total number of owners

## Deployment Steps

### 1. Compile the Contract

```bash
npx hardhat compile
```

Expected output:

```
Compiled 1 Solidity file successfully
```

### 2. Deploy to Sepolia

```bash
npx hardhat run deployment/deploy.js --network sepolia
```

Expected output:

```
Deploying contracts with the account: 0x...
Account balance: 0.5 ETH

Multisig Configuration:
Owners: [ '0x...', '0x...' ]
Required signatures: 2

✅ Token deployed to: 0x...

🔍 View on Etherscan:
   https://sepolia.etherscan.io/address/0x...

📝 Update your .env file:
CONTRACT_ADDRESS = "0x..."
```

### 3. Update .env

Copy the contract address from the deployment output and add it to your `.env`:

```bash
CONTRACT_ADDRESS="0xYourDeployedContractAddress"
```

### 4. Verify on Etherscan (Optional)

Wait 1-2 minutes for the contract to be indexed, then:

```bash
npx hardhat run deployment/verify.js --network sepolia
```

This makes your contract source code publicly viewable and verifiable on Etherscan.

## Troubleshooting

### Insufficient Funds Error

- Make sure you have enough Sepolia ETH (at least 0.01 ETH recommended)
- Get more from faucets listed above

## Post-Deployment

After successful deployment:

1. ✅ Contract is live on Sepolia
2. 🔍 Viewable on [Sepolia Etherscan](https://sepolia.etherscan.io/)
3. 💰 Initial 42,000 tokens minted to deployer
4. 🔐 Multisig system active and ready for mint proposals

Next: See [USAGE.md](USAGE.md) to learn how to interact with your token.
