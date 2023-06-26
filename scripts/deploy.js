const hre = require('hardhat');
const { ethers } = hre;

async function main() {
  // Setup accounts
  const [deployers] = await ethers.getSigners();

  // Deploy CompanyRegistration
  const CompanyRegistration = await hre.ethers.getContractFactory(
    'CompanyRegistration'
  );
  const companyRegistration = await CompanyRegistration.deploy();
  await companyRegistration.deployed();

  console.log(
    `Deployed CompanyRegistration Contract at: ${companyRegistration.address}\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
