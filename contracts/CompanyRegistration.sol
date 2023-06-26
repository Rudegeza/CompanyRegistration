// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract CompanyRegistration {
    address public owner;

    struct Company {
        string name;
        string tinNumber;
        bool hasInsurance;
    }

    mapping(address => Company) public companies;

    event CompanyRegistered(string name, string tinNumber, bool hasInsurance);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerCompany(
        string memory _name,
        string memory _tinNumber,
        bool _hasInsurance
    ) public payable {
        require(msg.value >= 1 ether, "Insufficient registration fee");

        Company memory company = Company(_name, _tinNumber, _hasInsurance);
        companies[msg.sender] = company;

        emit CompanyRegistered(_name, _tinNumber, _hasInsurance);
    }

    function getCompanyDetails(
        address _companyAddress
    ) public view returns (Company memory) {
        return companies[_companyAddress];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
