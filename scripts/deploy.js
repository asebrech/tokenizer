async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();

  console.log("Account balance:", await ethers.utils.formatEther(weiAmount));

  // Define multisig owners (add more addresses as needed)
  const owners = [
    deployer.address, // First owner (deployer)
    "0x76FB103D48D7e2719FE2D4470337120498233218",
    // Add more owner addresses here:
    // "0x1234567890123456789012345678901234567890",
    // "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
  ];

  // Number of signatures required to execute a transaction
  const requiredSignatures = 2; // Change this to require more signatures (e.g., 2 out of 3)

  console.log("\nMultisig Configuration:");
  console.log("Owners:", owners);
  console.log("Required signatures:", requiredSignatures);

  // Deploy the contract with multisig parameters
  const Token = await ethers.getContractFactory("GoofyGoober");
  const token = await Token.deploy(owners, requiredSignatures);

  await token.deployed();

  console.log("\nToken deployed to:", token.address);
  console.log("\nTo mint tokens, owners must:");
  console.log("1. Call submitMintTransaction(recipientAddress, amount)");
  console.log(
    "2. Other owners call confirmTransaction(txId) until required signatures are met"
  );
  console.log("3. Transaction will auto-execute when threshold is reached");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
