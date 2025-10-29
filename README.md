# DontPanic42 Token

An ERC20 token with built-in multisignature functionality for secure minting operations.

## Platform Choice: Ethereum (Sepolia Testnet)

### Why Ethereum?

I chose **Ethereum** as the blockchain platform for the following reasons:

1. **Industry Standard**: Ethereum is the most widely adopted platform for smart contracts and tokens, with the largest developer community and extensive documentation.

2. **ERC20 Standard**: The ERC20 token standard is battle-tested, widely supported by wallets and exchanges, and provides interoperability across the entire Ethereum ecosystem.

3. **Security & Maturity**: Ethereum has been operational since 2015, with proven security and a robust consensus mechanism.

4. **Development Tools**: Rich ecosystem of development tools (Hardhat, OpenZeppelin, ethers.js) making development, testing, and deployment straightforward.

5. **Testnet Availability**: Sepolia testnet provides a risk-free environment for deployment and testing without using real funds.

### Why Solidity?

**Solidity** was chosen as the programming language because:

- Native language for Ethereum smart contracts
- Extensive library support (OpenZeppelin for secure, audited contracts)
- Strong typing and security features
- Active community and regular updates (currently using Solidity ^0.8.28)

## Token Information

- **Name**: DontPanic42
- **Symbol**: PANIC
- **Standard**: ERC20
- **Initial Supply**: 42,000 tokens
- **Network**: Sepolia Testnet
- **Contract Address**: `0xD1D920D8A8BA0F148e46fdbB7271Cfc9aA8e230a`
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xD1D920D8A8BA0F148e46fdbB7271Cfc9aA8e230a)

## Features

### Standard ERC20 Functionality
- Transfer tokens between addresses
- Approve spending allowances
- Check balances and total supply

### Multisignature Security (Bonus)
- **Secure Minting**: New tokens can only be minted with approval from multiple owners
- **Transaction Proposals**: Any owner can propose a mint transaction
- **Signature Requirements**: All owners must approve before execution
- **Automatic Execution**: Transaction executes automatically when threshold is reached
- **Transparency**: All proposals and confirmations are tracked on-chain

## Repository Structure

```
tokenizer/
├── README.md              # This file - project overview and choices
├── code/                  # Smart contract source code
│   └── Token.sol         # DontPanic42 ERC20 token with multisig
├── deployment/            # Deployment and verification scripts
│   ├── deploy.js         # Deployment script with setup instructions
│   └── verify.js         # Etherscan verification script
├── documentation/         # Complete project documentation
│   ├── DEPLOYMENT.md     # How to deploy the token
│   ├── USAGE.md          # How to interact with the token
│   └── TECHNICAL.md      # Technical details and architecture
├── tasks/                 # Hardhat CLI tasks
│   └── multisig.js       # Custom tasks for multisig operations
├── hardhat.config.js      # Hardhat configuration
└── package.json          # Project dependencies
```

## Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- An Ethereum wallet (e.g., MetaMask)
- Sepolia testnet ETH (from faucet)

### Installation

```bash
# Clone the repository
git clone https://github.com/asebrech/tokenizer.git
cd tokenizer

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Compile

```bash
npx hardhat compile
```

### Deploy

```bash
npx hardhat run deployment/deploy.js --network sepolia
```

## Documentation

For detailed information, please refer to the `documentation/` folder:

- **[DEPLOYMENT.md](documentation/DEPLOYMENT.md)** - Complete deployment guide
- **[USAGE.md](documentation/USAGE.md)** - How to use the token and multisig features
- **[TECHNICAL.md](documentation/TECHNICAL.md)** - Technical architecture and security considerations

## Development Stack

- **Solidity**: ^0.8.28
- **Hardhat**: ^2.26.3
- **Ethers.js**: v6 (via @nomicfoundation/hardhat-toolbox)
- **OpenZeppelin Contracts**: ^5.3.0

## Security Considerations

- Multisig implementation prevents single points of failure
- OpenZeppelin's audited ERC20 implementation as base
- All owners must approve minting operations
- No ability to burn or confiscate tokens
- Transparent on-chain transaction tracking

## License

This project is unlicensed and created for educational purposes as part of the 42 School curriculum.
