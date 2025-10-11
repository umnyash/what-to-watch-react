import { screen, render } from '@testing-library/react';

import Logo from '../logo';

import SiteFooter from './site-footer';

vi.mock('../logo', () => ({
  default: vi.fn(() => null)
}));

describe('Component: SiteFooter', () => {
  const copyright = /©/;

  it('should render correctly', () => {
    render(<SiteFooter />);
    const copyrightElement = screen.getByText(copyright);

    expect(copyrightElement).toBeInTheDocument();
    expect(Logo).toHaveBeenCalledWith(
      { isLight: true },
      expect.anything()
    );
  });
});
