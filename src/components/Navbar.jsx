import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { CROSSFI_CHAIN_ID, NETWORK_CONFIG } from '../config/constants';

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [showDropdown, setShowDropdown] = useState(false);

  const updateWalletInfo = async (currentAccount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(currentAccount);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // First switch to CrossFi network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CROSSFI_CHAIN_ID }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: CROSSFI_CHAIN_ID,
                chainName: NETWORK_CONFIG.chainName,
                nativeCurrency: NETWORK_CONFIG.nativeCurrency,
                rpcUrls: NETWORK_CONFIG.rpcUrls
              }],
            });
          }
        }

        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        
        setAccount(accounts[0]);
        setBalance(ethers.formatEther(balance));
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + error.message);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount('');
    setBalance('0');
    setShowDropdown(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount('');
          setBalance('0');
        } else {
          setAccount(accounts[0]);
          updateWalletInfo(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== CROSSFI_CHAIN_ID) {
          setIsConnected(false);
          setAccount('');
          setBalance('0');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">VoteOnChain</Link>
      </div>
      <div className="nav-menu">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/create" className="nav-link">Create Campaign</Link>
      </div>
      {!isConnected ? (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-container">
          <div 
            className="wallet-info"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="balance">{parseFloat(balance).toFixed(4)} XFI</span>
            <span className="address">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
          {showDropdown && (
            <div className="wallet-dropdown">
              <button onClick={disconnectWallet}>Disconnect</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
} 