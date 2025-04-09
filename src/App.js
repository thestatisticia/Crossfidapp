import React from 'react';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// Navbar Component
function Navbar() {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">CrossFi Vote</Link>
      </div>
      <div className="nav-menu">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/create" className="nav-link">Create Campaign</Link>
      </div>
      <button 
        className={`connect-button ${isConnected ? 'connected' : ''}`}
        onClick={() => setIsConnected(!isConnected)}
      >
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </button>
    </nav>
  );
}

// Home Page Component
function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Decentralized Voting Platform</h1>
          <p>Create and participate in transparent, secure voting campaigns powered by CrossFi blockchain</p>
          <div className="hero-buttons">
            <Link to="/create" className="button primary">Create Campaign</Link>
            <Link to="/dashboard" className="button secondary">View Campaigns</Link>
          </div>
        </div>
      </section>
      <section className="features">
        <h2>Why Choose CrossFi Vote?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Transparent</h3>
            <p>All votes are recorded on the blockchain, ensuring complete transparency and security</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Efficient</h3>
            <p>Quick voting process with real-time results and minimal transaction fees</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Decentralized</h3>
            <p>No central authority - voting power directly in the hands of the community</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const [campaigns] = React.useState([
    {
      id: 1,
      title: "Community Development Fund",
      description: "Proposal to allocate funds for local development projects",
      votesFor: 156,
      votesAgainst: 45,
      endTime: Date.now() + 86400000,
      creator: "0x1234...5678"
    },
    {
      id: 2,
      title: "Protocol Upgrade Proposal",
      description: "Implementation of new security features and performance improvements",
      votesFor: 230,
      votesAgainst: 12,
      endTime: Date.now() + 172800000,
      creator: "0x8765...4321"
    }
  ]);

  return (
    <div className="dashboard">
      <h1>Active Campaigns</h1>
      <div className="campaign-grid">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <div className="vote-stats">
              <div className="vote-bar">
                <div 
                  className="vote-progress"
                  style={{ 
                    width: `${(campaign.votesFor / (campaign.votesFor + campaign.votesAgainst || 1)) * 100}%`
                  }}
                />
              </div>
              <div className="vote-counts">
                <span>For: {campaign.votesFor}</span>
                <span>Against: {campaign.votesAgainst}</span>
              </div>
            </div>
            <div className="vote-actions">
              <button className="button vote-for">Vote For</button>
              <button className="button vote-against">Vote Against</button>
            </div>
            <div className="campaign-footer">
              <span>Created by: {campaign.creator}</span>
              <span>Ends: {new Date(campaign.endTime).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Create Campaign Component
function CreateCampaign() {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    duration: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign created:', formData);
  };

  return (
    <div className="create-campaign">
      <h1>Create New Campaign</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Campaign Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter campaign title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your campaign"
              required
              rows="6"
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
            />
          </div>
          <button type="submit" className="button primary">Create Campaign</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateCampaign />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
