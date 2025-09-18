import { HelmetProvider } from 'react-helmet-async';
import { render, waitFor } from '@testing-library/react';

import { AppRoute, PageTitle } from '../../const';
import SiteHeader from '../../components/site-header';
import SiteFooter from '../../components/site-footer';
import Button, { ButtonType, ButtonSize } from '../../components/button';

import NotFoundPage from './not-found-page';

vi.mock('../../components/site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/site-footer', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/button', async () => {
  const originalModule = await vi.importActual('../../components/button');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

describe('Component: NotFoundPage', () => {
  it('should render correctly', () => {
    render(
      <HelmetProvider>
        <NotFoundPage />
      </HelmetProvider>
    );

    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith(
      {
        className: 'user-page__head',
        heading: '404 Not Found',
      },
      expect.anything()
    );
    expect(Button).toHaveBeenCalledOnce();
    expect(Button).toHaveBeenCalledWith(
      {
        children: 'Go to Homepage',
        type: ButtonType.Route,
        size: ButtonSize.L,
        to: AppRoute.Root,
      },
      expect.anything()
    );

    expect(SiteFooter).toHaveBeenCalledOnce();
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <NotFoundPage />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(PageTitle.NotFound));
  });
});
