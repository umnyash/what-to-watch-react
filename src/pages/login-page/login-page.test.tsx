import { HelmetProvider } from 'react-helmet-async';
import { render, waitFor } from '@testing-library/react';

import { PageTitle } from '../../const';
import SiteHeader from '../../components/site-header';
import SiteFooter from '../../components/site-footer';
import LoginForm from '../../components/login-form';

import LoginPage from './login-page';

vi.mock('../../components/site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/site-footer', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/login-form', () => ({
  default: vi.fn(() => null)
}));

describe('Component: LoginPage', () => {
  it('should render correctly', () => {
    render(
      <HelmetProvider>
        <LoginPage />
      </HelmetProvider>
    );

    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith(
      {
        className: 'user-page__head',
        heading: 'Sign in',
      },
      expect.anything()
    );
    expect(LoginForm).toHaveBeenCalledOnce();
    expect(SiteFooter).toHaveBeenCalledOnce();
  });

  it('should set page title correctly', async () => {
    render(
      <HelmetProvider>
        <LoginPage />
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toBe(PageTitle.Login));
  });
});
