import { ethers } from 'ethers';
import VotingSystemArtifact from './VotingSystem.json';
import contractAddress from './contract-address.json';

export const CROSSFI_CHAIN_ID = '0x103D'; // 4157 in hex
export const CROSSFI_RPC_URL = 'https://rpc.testnet.ms';

export const getContract = async (signer) => {
  return new ethers.Contract(
    contractAddress.VotingSystem,
    VotingSystemArtifact.abi,
    signer
  );
};

export const switchToCrossFiNetwork = async () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CROSSFI_CHAIN_ID }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CROSSFI_CHAIN_ID,
            chainName: 'CrossFi Testnet',
            nativeCurrency: {
              name: 'XFI',
              symbol: 'XFI',
              decimals: 18
            },
            rpcUrls: [CROSSFI_RPC_URL]
          }],
        });
      } catch (addError) {
        throw addError;
      }
    }
    throw switchError;
  }
};