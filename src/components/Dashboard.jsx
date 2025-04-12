import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/constants';

export function Dashboard() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Community Development Fund",
      description: "Proposal to allocate funds for local development projects and infrastructure improvements in the CrossFi ecosystem.",
      votesFor: 156,
      votesAgainst: 45,
      creator: "0x1234...5678",
      endTime: Date.now() + 86400000,
      active: true
    },
    {
      id: 2,
      title: "Protocol Upgrade Proposal",
      description: "Implementation of new security features and performance improvements for the CrossFi network.",
      votesFor: 230,
      votesAgainst: 12,
      creator: "0x8765...4321",
      endTime: Date.now() + 172800000,
      active: true
    },
    {
      id: 3,
      title: "CrossFi Governance Update",
      description: "Proposal to enhance the governance mechanism and voting parameters for better community participation.",
      votesFor: 189,
      votesAgainst: 23,
      creator: "0x9876...5432",
      endTime: Date.now() - 86400000,
      active: false
    }
  ]);

  const [loading, setLoading] = useState(false);

  const handleVote = async (campaignId, voteType) => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your wallet first!');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Estimate gas for voting
      const gasEstimate = await contract.vote.estimateGas(
        campaignId,
        voteType === 'for' ? true : false
      );

      // Add 20% buffer to gas estimate
      const gasLimit = Math.ceil(gasEstimate * 1.2);

      const tx = await contract.vote(
        campaignId,
        voteType === 'for' ? true : false,
        {
          gasLimit
        }
      );

      console.log('Vote transaction sent:', tx.hash);
      await tx.wait();
      alert('Vote cast successfully!');
      
      // Update the local state to reflect the vote
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => {
          if (campaign.id === campaignId) {
            return {
              ...campaign,
              votesFor: voteType === 'for' ? campaign.votesFor + 1 : campaign.votesFor,
              votesAgainst: voteType === 'against' ? campaign.votesAgainst + 1 : campaign.votesAgainst
            };
          }
          return campaign;
        })
      );
    } catch (error) {
      console.error('Voting error:', error);
      alert(`Error: ${error.message || 'Failed to cast vote. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <section className="campaigns-section">
        <h2 className="section-title">Active Campaigns</h2>
        <div className="campaign-grid">
          {campaigns.filter(c => c.active).map(campaign => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <h3>{campaign.title}</h3>
                <span className="campaign-status active">Active</span>
              </div>
              <p className="campaign-description">{campaign.description}</p>
              <div className="vote-stats">
                <div className="vote-bar-container">
                  <div className="vote-bar">
                    <div 
                      className="vote-progress"
                      style={{ 
                        width: `${(campaign.votesFor / (campaign.votesFor + campaign.votesAgainst || 1)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="vote-numbers">
                    <span className="votes-for">For: {campaign.votesFor}</span>
                    <span className="votes-against">Against: {campaign.votesAgainst}</span>
                  </div>
                </div>
              </div>
              <div className="vote-actions">
                <button 
                  className="button vote-for" 
                  onClick={() => handleVote(campaign.id, 'for')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Vote For'}
                </button>
                <button 
                  className="button vote-against"
                  onClick={() => handleVote(campaign.id, 'against')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Vote Against'}
                </button>
              </div>
              <div className="campaign-footer">
                <span>Created by: {campaign.creator}</span>
                <span>Ends: {new Date(campaign.endTime).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="campaigns-section">
        <h2 className="section-title">Completed Campaigns</h2>
        <div className="campaign-grid">
          {campaigns.filter(c => !c.active).map(campaign => (
            <div key={campaign.id} className="campaign-card completed">
              <div className="campaign-header">
                <h3>{campaign.title}</h3>
                <span className="campaign-status completed">Completed</span>
              </div>
              <p className="campaign-description">{campaign.description}</p>
              <div className="vote-stats">
                <div className="vote-bar-container">
                  <div className="vote-bar">
                    <div 
                      className="vote-progress completed"
                      style={{ 
                        width: `${(campaign.votesFor / (campaign.votesFor + campaign.votesAgainst || 1)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="vote-numbers">
                    <span className="votes-for">Final For: {campaign.votesFor}</span>
                    <span className="votes-against">Final Against: {campaign.votesAgainst}</span>
                  </div>
                </div>
              </div>
              <div className="campaign-footer">
                <span>Created by: {campaign.creator}</span>
                <span>Ended: {new Date(campaign.endTime).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="statistics-section">
        <div className="statistics-card">
          <h2>Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Campaigns</span>
              <span className="stat-value">{campaigns.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Campaigns</span>
              <span className="stat-value">{campaigns.filter(c => c.active).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Votes</span>
              <span className="stat-value">
                {campaigns.reduce((acc, campaign) => acc + campaign.votesFor + campaign.votesAgainst, 0)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Participation Rate</span>
              <span className="stat-value">78%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 