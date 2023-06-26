const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CompanyRegistration', () => {
  let companyRegistration;
  let deployer, registrator;

  beforeEach(async () => {
    // Setup accounts
    [deployer, registrator] = await ethers.getSigners();

    // Deploy contract
    const CompanyRegistration = await ethers.getContractFactory(
      'CompanyRegistration'
    );
    companyRegistration = await CompanyRegistration.deploy();
  });

  describe('Deployment', () => {
    it('Sets the owner', async () => {
      expect(await companyRegistration.owner()).to.equal(deployer.address);
    });
  });

  describe('Registration', () => {
    let transaction;

    beforeEach(async () => {
      // Register a company
      transaction = await companyRegistration
        .connect(registrator)
        .registerCompany('Company Name', 'TIN Number', true, {
          value: ethers.utils.parseEther('1'),
        });
      await transaction.wait();
    });

    it('Registers a company with the provided details', async () => {
      const company = await companyRegistration.companies(registrator.address);

      expect(company.name).to.equal('Company Name');
      expect(company.tinNumber).to.equal('TIN Number');
      expect(company.hasInsurance).to.equal(true);
    });

    it('Emits CompanyRegistered event', () => {
      expect(transaction).to.emit(companyRegistration, 'CompanyRegistered');
    });
  });

  describe('Company Details', () => {
    let transaction;

    beforeEach(async () => {
      // Register a company
      transaction = await companyRegistration
        .connect(registrator)
        .registerCompany('Company Name', 'TIN Number', true, {
          value: ethers.utils.parseEther('1'),
        });
      await transaction.wait();
    });

    it('Retrieves company details', async () => {
      const result = await companyRegistration.getCompanyDetails(
        registrator.address
      );

      expect(result.name).to.equal('Company Name');
      expect(result.tinNumber).to.equal('TIN Number');
      expect(result.hasInsurance).to.equal(true);
    });
  });
});
