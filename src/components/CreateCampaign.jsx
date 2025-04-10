import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CROSSFI_CHAIN_ID } from '../config/constants';
import { validateCampaign } from '../utils/validation';
import { estimateGas } from '../utils/web3';
import { useCampaignContext } from '../context/CampaignContext';
import { getErrorMessage } from '../utils/errors';

export function CreateCampaign() {
  const navigate = useNavigate();
  const { addCampaign } = useCampaignContext();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('campaignDraft');
    return saved ? JSON.parse(saved) : {
      title: '',
      description: '',
      duration: 1
    };
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Save draft to localStorage when form changes
  useEffect(() => {
    localStorage.setItem('campaignDraft', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const validationErrors = validateCampaign(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CROSSFI_CHAIN_ID }],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Convert duration from days to seconds
      const durationInSeconds = formData.title * 24 * 60 * 60;

      // Estimate gas dynamically
      const gasLimit = await estimateGas(contract, 'createCampaign', [
        formData.title,
        formData.description,
        durationInSeconds
      ]);

      const tx = await contract.createCampaign(
        formData.title,
        formData.description,
        durationInSeconds,
        {
          gasLimit: Math.ceil(gasLimit * 1.1) // Add 10% buffer
        }
      );

      // Show transaction progress
      alert('Transaction submitted');

      const receipt = await tx.wait();
      
      alert('Campaign created successfully!');

      // Clear form and localStorage
      localStorage.removeItem('campaignDraft');
      setFormData({ title: '', description: '', duration: 1 });
      
      // Add to global state
      addCampaign({
        title: formData.title,
        description: formData.description,
        duration: durationInSeconds,
        transactionHash: receipt.hash
      });

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Detailed error:', error);
      
      const errorMessage = getErrorMessage(error);
      alert('Operation Failed: ' + errorMessage);
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
              onChange={(e) => {
                setFormData({...formData, title: e.target.value});
                setErrors({...errors, title: ''});
              }}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter campaign title"
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({...formData, description: e.target.value});
                setErrors({...errors, description: ''});
              }}
              className={`form-input ${errors.description ? 'error' : ''}`}
              rows="6"
              placeholder="Enter campaign description"
              maxLength={1000}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/1000</span>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (days)</label>
            <input
              type="number"
              id="duration"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => {
                setFormData({...formData, duration: parseInt(e.target.value)});
                setErrors({...errors, duration: ''});
              }}
              className={`form-input ${errors.duration ? 'error' : ''}`}
            />
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>

          <button 
            type="submit" 
            className="button primary" 
            disabled={loading}
          >
            {loading ? (
              <div className="button-content">
                <span>Creating Campaign</span>
                <div className="spinner"></div>
              </div>
            ) : (
              'Create Campaign'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 