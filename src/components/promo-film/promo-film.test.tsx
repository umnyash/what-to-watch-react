import { screen, render } from '@testing-library/react';

import { withStore } from '../../tests/render-helpers';
import { promoFilmSelectors } from '../../store/promo-film/promo-film.selectors';
import { getMockPromoFilm } from '../../mocks/data';
import SiteHeader from '../site-header';
import FilmHeader from '../film-header';
import Spinner from '../spinner';
import ErrorMessage from '../error-message';

import PromoFilm from './promo-film';

vi.mock('../site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../spinner', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../film-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../error-message', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/promo-film/promo-film.selectors', () => ({
  promoFilmSelectors: {
    film: vi.fn(),
    isLoading: vi.fn(),
    isLoaded: vi.fn(),
    isLoadFailed: vi.fn(),
  }
}));

describe('Component: PromoFilm', () => {
  const { withStoreComponent } = withStore(<PromoFilm />);
  const mockedSelectors = vi.mocked(promoFilmSelectors);

  beforeEach(() => {
    mockedSelectors.film.mockReturnValue(null);
    mockedSelectors.isLoading.mockReturnValue(false);
    mockedSelectors.isLoaded.mockReturnValue(false);
    mockedSelectors.isLoadFailed.mockReturnValue(false);

    vi.clearAllMocks();
  });

  it('should always render heading and site header', () => {
    const heading = 'WTW';

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading', { name: heading });

    expect(headingElement).toBeInTheDocument();
    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith(
      {
        className: 'film-card__head',
        withUserNavigation: true,
      },
      expect.anything()
    );
  });

  it('should render Spinner when isLoading selector returns true', () => {
    mockedSelectors.isLoading.mockReturnValue(true);

    render(withStoreComponent);

    expect(Spinner).toHaveBeenCalledOnce();
    expect(ErrorMessage).not.toHaveBeenCalled();
    expect(FilmHeader).not.toHaveBeenCalled();
  });

  it('should render FilmHeader and images when isLoaded selector returns true and film selector returns film data', () => {
    const mockFilm = getMockPromoFilm();
    mockedSelectors.isLoaded.mockReturnValue(true);
    mockedSelectors.film.mockReturnValue(mockFilm);

    render(withStoreComponent);
    const backgroundImageElement = screen.getByAltText(mockFilm.name);
    const posterImageElement = screen.getByAltText(`${mockFilm.name} poster`);

    expect(backgroundImageElement).toHaveAttribute('src', mockFilm.backgroundImage);
    expect(posterImageElement).toHaveAttribute('src', mockFilm.posterImage);
    expect(FilmHeader).toHaveBeenCalledOnce();
    expect(FilmHeader).toHaveBeenCalledWith(
      { film: mockFilm },
      expect.anything()
    );
    expect(Spinner).not.toHaveBeenCalledOnce();
    expect(ErrorMessage).not.toHaveBeenCalled();
  });

  it('should render ErrorMessage when isLoadFailed selector returns true', () => {
    mockedSelectors.isLoadFailed.mockReturnValue(true);

    render(withStoreComponent);

    expect(ErrorMessage).toHaveBeenCalledOnce();
    expect(ErrorMessage).toHaveBeenCalledWith(
      {
        text: 'We couldn\'t load the promo film. Please try again later.',
        onRetryButtonClick: expect.any(Function) as unknown as () => void,
      },
      expect.anything()
    );
    expect(Spinner).not.toHaveBeenCalledOnce();
    expect(FilmHeader).not.toHaveBeenCalled();
  });
});
