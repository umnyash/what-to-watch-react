import { HelmetProvider } from 'react-helmet-async';
import { render, waitFor } from '@testing-library/react';

import { PageTitle } from '../../const';
import SiteHeader from '../../components/site-header';
import ErrorMessage from '../../components/error-message';

import ErrorPage from './error-page';

vi.mock('../../components/site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/error-message', () => ({
  default: vi.fn(() => null)
}));

describe('Component: ErrorPage', () => {
  const title = PageTitle.Film;
  const mockErrorText = 'Lorem ipsum';
  const mockRetryButtonClickHandler = vi.fn();

  it('should render correctly', () => {
    render(
      <HelmetProvider>
        <ErrorPage
          title={title}
          text={mockErrorText}
          onRetryButtonClick={mockRetryButtonClickHandler}
        />
      </HelmetProvider>
    );

    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith(
      {
        className: 'user-page__head',
        withUserNavigation: true
      },
      expect.anything()
    );
    expect(ErrorMessage).toHaveBeenCalledOnce();
    expect(ErrorMessage).toHaveBeenCalledWith(
      {
        text: mockErrorText,
        onRetryButtonClick: mockRetryButtonClickHandler,
      },
      expect.anything()
    );
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <ErrorPage
          title={title}
          text={mockErrorText}
          onRetryButtonClick={mockRetryButtonClickHandler}
        />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(title));
  });
});
