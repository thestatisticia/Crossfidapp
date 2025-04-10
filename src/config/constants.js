export const CONTRACT_ADDRESS = '0x5aE925E76f63906e725d2f87a8468ACFb93590dE';
export const CROSSFI_CHAIN_ID = '0x103D';
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "CampaignCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
  // Add other contract functions here
];

export const NETWORK_CONFIG = {
  chainId: CROSSFI_CHAIN_ID,
  chainName: 'CrossFi Testnet',
  nativeCurrency: {
    name: 'XFI',
    symbol: 'XFI',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.ms']
}; 