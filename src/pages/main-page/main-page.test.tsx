import { HelmetProvider } from 'react-helmet-async';
import { render, waitFor } from '@testing-library/react';

import { PageTitle } from '../../const';
import PromoFilm from '../../components/promo-film';
import Catalog from '../../components/catalog';
import SiteFooter from '../../components/site-footer';

import MainPage from './main-page';

vi.mock('../../components/promo-film', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/catalog', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/site-footer', () => ({
  default: vi.fn(() => null)
}));

describe('Component: MainPage', () => {
  it('should render correctly', () => {
    render(
      <HelmetProvider>
        <MainPage />
      </HelmetProvider>
    );

    expect(PromoFilm).toHaveBeenCalledOnce();
    expect(Catalog).toHaveBeenCalledOnce();
    expect(SiteFooter).toHaveBeenCalledOnce();
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <MainPage />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(PageTitle.Main));
  });
});
