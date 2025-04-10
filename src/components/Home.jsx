import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Decentralized <span>Voting</span> Made Simple</h1>
          <p className="hero-subtitle">
            Create and participate in transparent, secure voting campaigns powered by CrossFi blockchain technology
          </p>
          <div className="hero-buttons">
            <Link to="/create" className="button primary">
              <span>Create Campaign</span>
              <span>→</span>
            </Link>
            <Link to="/dashboard" className="button secondary">
              <span>View Campaigns</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose VoteOnChain?</h2>
        <p className="features-subtitle">
          Experience the future of voting with our cutting-edge blockchain platform
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure & Transparent</h3>
            <p>Every vote is recorded on the blockchain, ensuring complete transparency and immutability of results</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Fast & Efficient</h3>
            <p>Quick voting process with real-time results and minimal transaction fees</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌐</span>
            <h3>Decentralized</h3>
            <p>No central authority - voting power directly in the hands of the community</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">100+</span>
            <span className="stat-label">Active Campaigns</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">10k+</span>
            <span className="stat-label">Total Votes</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">99%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </section>

      {/* <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Connect Wallet</h3>
            <p>Connect your CrossFi wallet to get started</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Create or Vote</h3>
            <p>Create a new campaign or vote on existing ones</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Track Results</h3>
            <p>Monitor voting results in real-time</p>
          </div>
        </div>
      </section>  */}
    </div>
  );
} 