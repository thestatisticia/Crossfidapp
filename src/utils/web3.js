export const estimateGas = async (contract, method, args) => {
  try {
    const gasEstimate = await contract.estimateGas[method](...args);
    return gasEstimate;
  } catch (error) {
    console.error('Gas estimation failed:', error);
    throw new Error('Failed to estimate gas. Please try again.');
  }
};

export const getErrorMessage = (error) => {
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected by user';
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for gas';
  } else if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection';
  } else if (error.message.includes('user rejected')) {
    return 'Transaction was rejected by user';
  } else {
    return error.message || 'An unexpected error occurred';
  }
}; 