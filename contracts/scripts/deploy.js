const hre = require("hardhat");

async function main() {
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();

  await votingSystem.waitForDeployment();

  const address = await votingSystem.getAddress();
  console.log("VotingSystem deployed to:", address);

  // Save the contract address to a file that can be imported by the frontend
  const fs = require("fs");
  const contractsDir = __dirname + "/../";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ VotingSystem: address }, undefined, 2)
  );

  // Copy the contract artifacts to the src directory
  const VotingSystemArtifact = artifacts.readArtifactSync("VotingSystem");

  fs.writeFileSync(
    contractsDir + "/VotingSystem.json",
    JSON.stringify(VotingSystemArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });