import { render } from '@testing-library/react';

import { withStore } from '../../tests/render-helpers';
import { getMockFilms } from '../../mocks/data';
import { similarFilmsSelectors } from '../../store/similar-films/similar-films.selectors';
import Films from '../films';
import ErrorMessage from '../error-message';
import Spinner from '../spinner';

import SimilarFilms from './similar-films';

vi.mock('../../store/similar-films/similar-films.selectors', () => ({
  similarFilmsSelectors: {
    filmId: vi.fn(),
    someRandomFilms: vi.fn(),
    isLoading: vi.fn(),
    isLoaded: vi.fn(),
    isLoadFailed: vi.fn(),
  }
}));

vi.mock('../films', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../error-message', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../spinner', () => ({
  default: vi.fn(() => null)
}));

describe('Component: SimilarFilms', () => {
  const mockFilmId = 'some-film-id';
  const heading = 'More like this';
  const mockFilms = getMockFilms(2);
  const { withStoreComponent } = withStore(<SimilarFilms filmId={mockFilmId} />);
  const mockedSelectors = vi.mocked(similarFilmsSelectors);

  beforeEach(() => {
    mockedSelectors.filmId.mockReturnValue(null);
    mockedSelectors.someRandomFilms.mockReturnValue([]);
    mockedSelectors.isLoading.mockReturnValue(false);
    mockedSelectors.isLoaded.mockReturnValue(false);
    mockedSelectors.isLoadFailed.mockReturnValue(false);

    vi.clearAllMocks();
  });

  describe('when filmId selector returned value matches filmId prop value', () => {
    it('should render only films component when isLoaded selector returns true', () => {
      mockedSelectors.filmId.mockReturnValue(mockFilmId);
      mockedSelectors.someRandomFilms.mockReturnValue(mockFilms);
      mockedSelectors.isLoaded.mockReturnValue(true);

      render(withStoreComponent);

      expect(Films).toHaveBeenCalledOnce();
      expect(Films).toHaveBeenCalledWith(
        { heading, films: mockFilms },
        expect.anything()
      );
      expect(ErrorMessage).not.toHaveBeenCalled();
      expect(Spinner).not.toHaveBeenCalled();
    });

    it('should render only error message component when isLoadFailed selector returns true', () => {
      mockedSelectors.filmId.mockReturnValue(mockFilmId);
      mockedSelectors.isLoadFailed.mockReturnValue(true);

      render(withStoreComponent);

      expect(ErrorMessage).toHaveBeenCalledOnce();
      expect(ErrorMessage).toHaveBeenCalledWith(
        {
          text: 'We couldn\'t load the similar films. Please try again later.',
          onRetryButtonClick: expect.any(Function) as unknown as () => void,
        },
        expect.anything()
      );
      expect(Films).not.toHaveBeenCalled();
      expect(Spinner).not.toHaveBeenCalled();
    });
  });

  it.each([
    [mockFilmId, true, false, false],
    ['anotherFilmId', true, false, false],
    ['anotherFilmId', false, true, false],
    ['anotherFilmId', false, false, true],
  ])(
    'should render only Spinner component when filmId selector returned value mismatch filmId prop value or isLoading selector returns true',
    (filmId, isLoading, isLoaded, isLoadFailed) => {
      mockedSelectors.filmId.mockReturnValue(filmId);
      mockedSelectors.isLoading.mockReturnValue(isLoading);
      mockedSelectors.isLoaded.mockReturnValue(isLoaded);
      mockedSelectors.isLoadFailed.mockReturnValue(isLoadFailed);

      render(withStoreComponent);

      expect(Spinner).toHaveBeenCalledOnce();
      expect(Films).not.toHaveBeenCalled();
      expect(ErrorMessage).not.toHaveBeenCalled();
    }
  );
});
