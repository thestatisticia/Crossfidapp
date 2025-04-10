import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CampaignContext = createContext();

const campaignReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload]
      };
    case 'SET_CAMPAIGNS':
      return {
        ...state,
        campaigns: action.payload
      };
    default:
      return state;
  }
};

export function CampaignProvider({ children }) {
  const [state, dispatch] = useReducer(campaignReducer, {
    campaigns: []
  });

  const addCampaign = (campaign) => {
    dispatch({ type: 'ADD_CAMPAIGN', payload: campaign });
  };

  const setCampaigns = (campaigns) => {
    dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
  };

  return (
    <CampaignContext.Provider value={{ ...state, addCampaign, setCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
}

export const useCampaignContext = () => useContext(CampaignContext); 