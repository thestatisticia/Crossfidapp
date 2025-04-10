import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateCampaign } from '../CreateCampaign';
import { CampaignProvider } from '../../context/CampaignContext';
import { validateCampaign } from '../../utils/validation';

jest.mock('../../utils/web3');

describe('CreateCampaign', () => {
  beforeEach(() => {
    render(
      <CampaignProvider>
        <CreateCampaign />
      </CampaignProvider>
    );
  });

  test('validates form inputs correctly', async () => {
    const submitButton = screen.getByText('Create Campaign');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  // Add more tests...
}); 