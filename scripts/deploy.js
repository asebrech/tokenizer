async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Account balance:", ethers.formatEther(balance));

  // Define multisig owners
  const owners = [
    deployer.address,
    "0x76FB103D48D7e2719FE2D4470337120498233218",
  ];

  const requiredSignatures = owners.length;

  console.log("\nMultisig Configuration:");
  console.log("Owners:", owners);
  console.log("Required signatures:", requiredSignatures);

  // Deploy the contract with multisig parameters
  const Token = await ethers.getContractFactory("GoofyGoober");
  const token = await Token.deploy(owners, requiredSignatures);

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();

  console.log("\n✅ Token deployed to:", tokenAddress);
  console.log("\n📝 Update your .env file:");
  console.log(`CONTRACT_ADDRESS = "${tokenAddress}"`);

  console.log("\n🔐 How to mint tokens with multisig:");
  console.log("1. Submit a mint transaction:");
  console.log(
    "   npx hardhat multisig:submit --to <address> --amount <amount> --network sepolia"
  );
  console.log("\n2. Other owners confirm:");
  console.log("   npx hardhat multisig:confirm --txid <id> --network sepolia");
  console.log("   OR with specific key:");
  console.log(
    "   npx hardhat multisig:confirm-as --txid <id> --key <private_key> --network sepolia"
  );
  console.log("\n3. Transaction auto-executes when threshold is reached!");

  console.log("\n📊 View contract info:");
  console.log("   npx hardhat multisig:info --network sepolia");
  console.log("   npx hardhat multisig:owners --network sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
