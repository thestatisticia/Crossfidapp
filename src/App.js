import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CampaignProvider } from './context/CampaignContext';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { CreateCampaign } from './components/CreateCampaign';
import './App.css';

// Contract configuration
export const CONTRACT_ADDRESS = '0x5aE925E76f63906e725d2f87a8468ACFb93590dE';
export const CONTRACT_ABI = [
  // ... paste the entire ABI array here ...
];

export const CROSSFI_CHAIN_ID = '0x103D';
export const CROSSFI_RPC_URL = 'https://rpc.testnet.ms';

function App() {
  return (
    <CampaignProvider>
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
    </CampaignProvider>
  );
}

export default App;
