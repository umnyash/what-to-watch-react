import { HelmetProvider } from 'react-helmet-async';
import { screen, render, waitFor } from '@testing-library/react';

import { PageTitle } from '../../const';
import Spinner from '../../components/spinner';

import LoadingPage from './loading-page';

vi.mock('../../components/spinner', () => ({
  default: vi.fn(() => null)
}));

describe('Component: LoadingPage', () => {
  it('should render correctly', () => {
    const spinnerWrapperTestId = 'spinner-wrapper';

    render(
      <HelmetProvider>
        <LoadingPage />
      </HelmetProvider>
    );
    const spinnerWrapperElement = screen.getByTestId(spinnerWrapperTestId);

    expect(spinnerWrapperElement).toHaveStyle({
      display: 'grid',
      alignItems: 'center',
      flexGrow: 1
    });
    expect(Spinner).toHaveBeenCalledOnce();
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <LoadingPage />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(PageTitle.Loading));
  });
});
