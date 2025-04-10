import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = '0x5aE925E76f63906e725d2f87a8468ACFb93590dE';

export const CONTRACT_ABI = [
  // ... paste the entire ABI array here ...
];

export const CROSSFI_CHAIN_ID = '0x103D'; // 4157 in hex
export const CROSSFI_RPC_URL = 'https://rpc.testnet.ms';

export const getContract = async (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const switchToCrossFiNetwork = async () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CROSSFI_CHAIN_ID }],
    });
  } catch (switchError) {
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