import { HelmetProvider } from 'react-helmet-async';
import { screen, render, waitFor } from '@testing-library/react';

import { PageTitle } from '../../const';
import { getMockFilms } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';
import { favoritesSelectors } from '../../store/favorites/favorites.selectors';
import SiteHeader from '../../components/site-header';
import SiteFooter from '../../components/site-footer';
import Spinner from '../../components/spinner';
import ErrorMessage from '../../components/error-message';
import FilmsList from '../../components/films-list';

import MyListPage from './my-list-page';

vi.mock('../../components/site-header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/site-footer', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/spinner', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/error-message', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../components/films-list', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/favorites/favorites.selectors', () => ({
  favoritesSelectors: {
    films: vi.fn(),
    isLoading: vi.fn(),
    isLoaded: vi.fn(),
    isLoadFailed: vi.fn(),
  }
}));

describe('Component: MyListPage', () => {
  const mockedSelectors = vi.mocked(favoritesSelectors);
  const { withStoreComponent } = withStore(<MyListPage />);
  const preparedComponent = <HelmetProvider>{withStoreComponent}</HelmetProvider>;
  const mockFilms = getMockFilms(2);

  beforeEach(() => {
    mockedSelectors.films.mockReturnValue([]);
    mockedSelectors.isLoading.mockReturnValue(false);
    mockedSelectors.isLoaded.mockReturnValue(false);
    mockedSelectors.isLoadFailed.mockReturnValue(false);

    vi.clearAllMocks();
  });

  it('should set page title correctly', async () => {
    render(preparedComponent);
    await waitFor(() => expect(document.title).toBe(PageTitle.MyList));
  });

  it('should always render heading, SiteHeader and SiteFooter', () => {
    render(preparedComponent);
    const headingElement = screen.getByRole('heading', { level: 2, name: 'Catalog' });

    expect(headingElement).toBeInTheDocument();
    expect(SiteHeader).toHaveBeenCalledOnce();
    expect(SiteHeader).toHaveBeenCalledWith(
      {
        className: 'user-page__head',
        heading: 'My list',
        withUserNavigation: true,
      },
      expect.anything()
    );
    expect(SiteFooter).toHaveBeenCalledOnce();
  });

  it.each([
    [false, false, false, [], 'My list'],
    [true, false, false, [], 'My list'],
    [false, true, false, [], 'My list <span class="user-page__film-count">0</span>'],
    [false, true, false, mockFilms, `My list <span class="user-page__film-count">${mockFilms.length}</span>`],
    [false, false, true, [], 'My list'],
  ])(
    'should correcty pass heading markup to SiteHeader',
    (isLoading, isLoaded, isLoadFailed, films, expectedHeading) => {
      mockedSelectors.isLoading.mockReturnValue(isLoading);
      mockedSelectors.isLoaded.mockReturnValue(isLoaded);
      mockedSelectors.isLoadFailed.mockReturnValue(isLoadFailed);
      mockedSelectors.films.mockReturnValue(films);

      render(preparedComponent);
      const [[{ heading }]] = vi.mocked(SiteHeader).mock.calls;

      expect(heading).toBe(expectedHeading);
    }
  );

  it('should render Spinner when isLoading selector returns true', () => {
    mockedSelectors.isLoading.mockReturnValue(true);

    render(preparedComponent);

    expect(Spinner).toHaveBeenCalledOnce();
    expect(ErrorMessage).not.toHaveBeenCalled();
    expect(FilmsList).not.toHaveBeenCalled();
  });

  it('should render ErrorMessage when isLoadFailed returns true', () => {
    mockedSelectors.isLoadFailed.mockReturnValue(true);

    render(preparedComponent);

    expect(ErrorMessage).toHaveBeenCalledOnce();
    expect(ErrorMessage).toHaveBeenCalledWith(
      {
        text: 'We couldn\'t load the favorites. Please try again later.',
        onRetryButtonClick: expect.any(Function) as unknown as () => void,
      },
      expect.anything()
    );
    expect(Spinner).not.toHaveBeenCalled();
    expect(FilmsList).not.toHaveBeenCalled();
  });

  describe('when isLoaded selector returns true', () => {
    beforeEach(() => mockedSelectors.isLoaded.mockReturnValue(true));

    it('should not render FilmsList when favorites films count is 0', () => {
      render(preparedComponent);

      expect(Spinner).not.toHaveBeenCalled();
      expect(ErrorMessage).not.toHaveBeenCalled();
      expect(FilmsList).not.toHaveBeenCalled();
    });

    it('should render FilmsList when favorites films count more than 0', () => {
      mockedSelectors.films.mockReturnValue(mockFilms);

      render(preparedComponent);

      expect(FilmsList).toHaveBeenCalledOnce();
      expect(FilmsList).toHaveBeenCalledWith(
        { films: mockFilms },
        expect.anything()
      );
      expect(Spinner).not.toHaveBeenCalledOnce();
      expect(ErrorMessage).not.toHaveBeenCalled();
    });
  });
});
