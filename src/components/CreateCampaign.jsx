import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '../abi';

const CONTRACT_ADDRESS = '0x5aE925E76f63906e725d2f87a8468ACFb93590dE';
const CROSSFI_CHAIN_ID = '0x103D';

export function CreateCampaign() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      // Switch to CrossFi network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CROSSFI_CHAIN_ID }],
        });
      } catch (switchError) {
        console.error('Network switch error:', switchError);
        throw new Error('Please switch to the CrossFi network');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your wallet first!');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Convert duration to seconds (as a regular number)
      const durationInSeconds = Number(formData.duration) * 24 * 60 * 60;

      // Add these checks before creating the campaign
      if (formData.title.trim() === '') {
        throw new Error('Campaign title cannot be empty');
      }
      if (formData.description.trim() === '') {
        throw new Error('Campaign description cannot be empty');
      }
      if (formData.duration < 1 || formData.duration > 30) {
        throw new Error('Duration must be between 1 and 30 days');
      }

      console.log('Creating campaign with params:', {
        title: formData.title,
        description: formData.description,
        duration: durationInSeconds.toString(),
        contractAddress: CONTRACT_ADDRESS,
        userAddress: accounts[0]
      });

      // Add this after switching network
      const network = await provider.getNetwork();
      if (network.chainId.toString(16) !== CROSSFI_CHAIN_ID.toLowerCase().replace('0x', '')) {
        throw new Error('Please make sure you are connected to the CrossFi network');
      }

      // Create campaign with fixed gas limit
      const tx = await contract.createCampaign(
        formData.title,
        formData.description,
        durationInSeconds,
        {
          from: accounts[0],
          gasLimit: 500000, // Fixed gas limit
        }
      );

      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      alert('Campaign created successfully!');
      setFormData({ title: '', description: '', duration: 1 });
    } catch (error) {
      console.error('Detailed error:', error);
      
      let errorMessage = 'Failed to create campaign. ';
      if (error.message.includes('user rejected')) {
        errorMessage += 'Transaction was rejected by user.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage += 'Insufficient funds for gas.';
      } else if (error.message.includes('missing revert data')) {
        errorMessage += 'Contract execution failed. Please check your inputs and try again.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign">
      <h2>Create New Campaign</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Campaign Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              maxLength={100}
              className="form-input"
              placeholder="Enter campaign title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              maxLength={1000}
              className="form-input"
              rows="6"
              placeholder="Enter campaign description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (days)</label>
            <input
              type="number"
              id="duration"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              required
              className="form-input"
            />
          </div>
          <button 
            type="submit" 
            className="button primary" 
            disabled={loading}
          >
            {loading ? (
              <span>Creating... Please confirm in MetaMask</span>
            ) : (
              'Create Campaign'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 