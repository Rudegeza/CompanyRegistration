import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components

// ABIs
import CompanyRegistration from './abis/CompanyRegistration.json';

// Config
import config from './config.json';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [companyRegistration, setCompanyRegistration] = useState(null);

  const [companyName, setCompanyName] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);

  const loadBlockchainData = async () => {
    // Connect to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    console.log(network);
    // Connect to the smart contracts (Create JS Versions)
    const companyRegistration = new ethers.Contract(
      config[network.chainId].companyRegistration.address,
      CompanyRegistration,
      provider
    );
    setCompanyRegistration(companyRegistration);
  };

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  const registerCompany = async () => {
    try {
      // Check if the user is connected
      if (!account || !provider) {
        console.error('User is not connected');
        return;
      }

      // Create a signer with the provider and account
      const signer = provider.getSigner(account);

      // Connect to the smart contract using the signer
      const companyRegistrationWithSigner = companyRegistration.connect(signer);

      // Send the transaction with the signed method
      const nonce = await provider.getTransactionCount(account);
      const tx = await companyRegistrationWithSigner.registerCompany(
        companyName,
        tinNumber,
        hasInsurance,
        { value: ethers.utils.parseEther('1'), nonce }
      );
      await tx.wait();
      console.log('Company registered successfully!');
      // Additional code for success handling
    } catch (error) {
      console.error('Company registration failed:', error);
      // Additional code for error handling
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <nav>
        <div className="nav__brand">
          <h1>CompanyRegistration</h1>
        </div>
        <input type="text" className="nav__search" />

        {account ? (
          <button type="button" className="nav__connect">
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
        ) : (
          <button
            type="button"
            className="nav__connect"
            onClick={connectHandler}
          >
            Connect
          </button>
        )}
      </nav>
      <div className="container">
        <h2>Welcome to CompanyRegistration</h2>
        <form className="form">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <label htmlFor="tinNumber">TIN Number:</label>
          <input
            type="text"
            id="tinNumber"
            value={tinNumber}
            onChange={(e) => setTinNumber(e.target.value)}
            required
          />

          <div>
            <label htmlFor="hasInsurance">Has Insurance:</label>
            <input
              type="checkbox"
              id="hasInsurance"
              checked={hasInsurance}
              onChange={(e) => setHasInsurance(e.target.checked)}
              required
            />
          </div>

          <button type="button" onClick={registerCompany}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
