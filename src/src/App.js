import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CrossFi } from '@crossfi/sdk';
import styled from 'styled-components';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
`;

const ConnectButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  &:hover {
    background: #45a049;
  }
`;

function App() {
  const [account, setAccount] = useState('');
  const [projects, setProjects] = useState([]);
  const [crossFi, setCrossFi] = useState(null);

  useEffect(() => {
    initializeCrossFi();
  }, []);

  const initializeCrossFi = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const crossFiInstance = new CrossFi(provider);
      setCrossFi(crossFiInstance);
    } catch (error) {
      console.error('Error initializing CrossFi:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      // Here you would interact with your smart contract to create a project
      const newProject = {
        id: Date.now(),
        ...projectData,
        currentAmount: 0,
        creator: account
      };
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDonate = async (projectId) => {
    try {
      // Here you would interact with your smart contract to donate XFI tokens
      const project = projects.find(p => p.id === projectId);
      if (project) {
        // Implement donation logic using CrossFi SDK
        console.log('Donating to project:', projectId);
      }
    } catch (error) {
      console.error('Error donating:', error);
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>CrossFi Project DApp</Title>
        {!account ? (
          <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
        ) : (
          <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
        )}
      </Header>
      
      <ProjectForm onSubmit={handleCreateProject} />
      <ProjectList projects={projects} onDonate={handleDonate} />
    </AppContainer>
  );
}

export default App; 