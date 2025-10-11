import { screen, render } from '@testing-library/react';

import { AppRoute } from '../../const';
import { withHistory } from '../../tests/render-helpers';

import Logo from './logo';

describe('Component: Logo', () => {
  const logoTestId = 'logo';
  const logoInnerTestId = 'logo-inner';

  it('should render correctly', () => {
    const { withHistoryComponent } = withHistory(<Logo />);

    render(withHistoryComponent);
    const logoElement = screen.getByTestId(logoTestId);

    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveTextContent('WTW');
  });

  it('should not render link when current path is "/"', () => {
    const { withHistoryComponent } = withHistory(<Logo />, AppRoute.Root);
    render(withHistoryComponent);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render root page link when current path is not "/"', () => {
    const { withHistoryComponent } = withHistory(<Logo />, AppRoute.Film);

    render(withHistoryComponent);
    const linkElement = screen.getByRole('link');

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', AppRoute.Root);
  });

  describe('isLight prop', () => {
    it.each([
      {
        case: 'should not add additional link class by default',
      },
      {
        case: 'should not add additional link class when isLight prop is false',
        isLight: false,
      },
      {
        case: 'should add additional link class when isLight prop is true',
        isLight: true,
      },
    ])('$case', ({ isLight }) => {
      const { withHistoryComponent } = withHistory(<Logo isLight={isLight} />);

      render(withHistoryComponent);
      const logoInnerElement = screen.getByTestId(logoInnerTestId);

      if (isLight) {
        expect(logoInnerElement).toHaveAttribute('class', 'logo__link logo__link--light');
      } else {
        expect(logoInnerElement).toHaveAttribute('class', 'logo__link');
      }
    });
  });
});
