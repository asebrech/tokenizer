require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS in your .env file");
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();

  const owners = [
    deployer.address,
    "0x76FB103D48D7e2719FE2D4470337120498233218",
  ];
  const requiredSignatures = owners.length;

  console.log("Verifying contract:", contractAddress);
  console.log("Constructor args:");
  console.log("  Owners:", owners);
  console.log("  Required signatures:", requiredSignatures);

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [owners, requiredSignatures],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
