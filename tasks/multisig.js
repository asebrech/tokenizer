const { task } = require("hardhat/config");

task("multisig:info", "Display multisig contract information").setAction(
  async (taskArgs, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      return;
    }

    const Token = await hre.ethers.getContractFactory("DontPanic42");
    const token = Token.attach(contractAddress);

    console.log("\n--- Contract Information ---");
    const name = await token.name();
    const symbol = await token.symbol();
    const totalSupply = await token.totalSupply();
    const requiredSigs = await token.requiredSignatures();
    const txCount = await token.transactionCount();

    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Total Supply:", hre.ethers.formatEther(totalSupply), symbol);
    console.log("Required Signatures:", requiredSigs.toString());
    console.log("Total Transactions:", txCount.toString());
  }
);

task("multisig:owners", "List all multisig owners").setAction(
  async (taskArgs, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      return;
    }

    const Token = await hre.ethers.getContractFactory("DontPanic42");
    const token = Token.attach(contractAddress);

    console.log("\n--- Multisig Owners ---");
    const owners = await token.getOwners();
    const requiredSigs = await token.requiredSignatures();

    console.log(
      "Required Signatures:",
      requiredSigs.toString(),
      "out of",
      owners.length
    );
    console.log("\nOwners:");
    owners.forEach((owner, index) => {
      console.log(`  ${index + 1}. ${owner}`);
    });
  }
);

task("multisig:submit", "Submit a new mint transaction")
  .addParam("to", "The recipient address")
  .addParam("amount", "The amount of tokens to mint")
  .setAction(async (taskArgs, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      return;
    }

    const Token = await hre.ethers.getContractFactory("DontPanic42");
    const token = Token.attach(contractAddress);

    console.log("\n--- Submitting Mint Transaction ---");
    console.log("Recipient:", taskArgs.to);
    console.log("Amount:", taskArgs.amount, "tokens");

    const amountWei = hre.ethers.parseEther(taskArgs.amount);
    const tx = await token.submitMintTransaction(taskArgs.to, amountWei);
    const receipt = await tx.wait();

    const txId = receipt.logs
      .map((log) => {
        try {
          return token.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === "TransactionSubmitted")
      ?.args?.txId;

    console.log("✓ Transaction submitted!");
    console.log("Transaction ID:", txId.toString());
    console.log("Gas used:", receipt.gasUsed.toString());

    const txDetails = await token.getTransaction(txId);
    if (txDetails.executed) {
      console.log(
        "✓ Transaction was automatically executed (enough signatures)"
      );
    } else {
      console.log("⏳ Waiting for more signatures...");
      console.log("Confirmations:", txDetails.confirmationCount.toString());
      const requiredSigs = await token.requiredSignatures();
      console.log("Required:", requiredSigs.toString());
    }
  });

task("multisig:tx", "View transaction details")
  .addParam("txid", "The transaction ID to view")
  .setAction(async (taskArgs, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      return;
    }

    const Token = await hre.ethers.getContractFactory("DontPanic42");
    const token = Token.attach(contractAddress);

    console.log("\n--- Transaction Details ---");
    const tx = await token.getTransaction(taskArgs.txid);
    const requiredSigs = await token.requiredSignatures();

    console.log("Transaction ID:", taskArgs.txid);
    console.log("Recipient:", tx.to);
    console.log("Amount:", hre.ethers.formatEther(tx.amount), "tokens");
    console.log("Executed:", tx.executed);
    console.log(
      "Confirmations:",
      tx.confirmationCount.toString(),
      "/",
      requiredSigs.toString()
    );
  });

task("multisig:balance", "Check token balance")
  .addOptionalParam(
    "address",
    "The address to check (defaults to your address)"
  )
  .setAction(async (taskArgs, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      return;
    }

    const [signer] = await hre.ethers.getSigners();
    const address = taskArgs.address || signer.address;

    const Token = await hre.ethers.getContractFactory("DontPanic42");
    const token = Token.attach(contractAddress);

    console.log("\n--- Token Balance ---");
    console.log("Address:", address);

    const balance = await token.balanceOf(address);
    const symbol = await token.symbol();

    console.log("Balance:", hre.ethers.formatEther(balance), symbol);
  });

task(
  "multisig:confirm-as",
  "Confirm a transaction using a specific private key"
)
  .addParam("txid", "The transaction ID to confirm")
  .addParam("key", "The private key of the owner (without 0x prefix)")
  .setAction(async (taskArgs, hre) => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Please set CONTRACT_ADDRESS in your .env file");
      return;
    }

    // Create a signer from the provided private key
    const privateKey = taskArgs.key.startsWith("0x")
      ? taskArgs.key
      : `0x${taskArgs.key}`;
    const provider = new hre.ethers.JsonRpcProvider(process.env.API_URL);
    const signer = new hre.ethers.Wallet(privateKey, provider);

    console.log("\n--- Confirming Transaction ---");
    console.log("Using account:", signer.address);
    console.log("Transaction ID:", taskArgs.txid);

    const Token = await hre.ethers.getContractFactory("DontPanic42", signer);
    const token = Token.attach(contractAddress);

    // Check transaction status first
    const txDetails = await token.getTransaction(taskArgs.txid);

    if (txDetails.executed) {
      console.log("❌ Transaction has already been executed");
      console.log("Recipient:", txDetails.to);
      console.log(
        "Amount:",
        hre.ethers.formatEther(txDetails.amount),
        "tokens"
      );
      return;
    }

    // Check if already confirmed by this signer
    const alreadyConfirmed = await token.isConfirmed(
      taskArgs.txid,
      signer.address
    );

    if (alreadyConfirmed) {
      console.log("❌ This owner has already confirmed this transaction");
      console.log(
        "Current confirmations:",
        txDetails.confirmationCount.toString()
      );
      const requiredSigs = await token.requiredSignatures();
      console.log("Required:", requiredSigs.toString());
      return;
    }

    // Check if the signer is actually an owner
    const isOwner = await token.isOwner(signer.address);
    if (!isOwner) {
      console.log("❌ This address is not an owner of the multisig");
      console.log(
        "Use 'npx hardhat multisig:owners --network sepolia' to see valid owners"
      );
      return;
    }

    const tx = await token.confirmTransaction(taskArgs.txid);
    const receipt = await tx.wait();

    console.log("✓ Transaction confirmed by", signer.address);
    console.log("Gas used:", receipt.gasUsed.toString());

    const executedEvent = receipt.logs
      .map((log) => {
        try {
          return token.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === "TransactionExecuted");

    if (executedEvent) {
      console.log("✓ Transaction executed successfully!");
      console.log("🎉 Tokens have been minted!");
    } else {
      const updatedTxDetails = await token.getTransaction(taskArgs.txid);
      console.log("⏳ Still needs more signatures");
      console.log(
        "Confirmations:",
        updatedTxDetails.confirmationCount.toString()
      );
      const requiredSigs = await token.requiredSignatures();
      console.log("Required:", requiredSigs.toString());
    }
  });

module.exports = {};
