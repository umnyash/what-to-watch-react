import { Routes, Route, generatePath } from 'react-router-dom';
import { render } from '@testing-library/react';

import { AppRoute, PageTitle } from '../../const';
import { getMockPageFilm } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';
import { useFilm } from '../../hooks/use-film/use-film';
import LoadingPage from '../loading-page';
import PlayerPageContent from '../../components/player-page-content';
import ErrorPage from '../error-page';
import NotFoundPage from '../not-found-page';

import PlayerPage from './player-page';

vi.mock('../../components/player-page-content', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../not-found-page', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../error-page', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../loading-page', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../hooks/use-film/use-film', () => ({
  useFilm: vi.fn()
}));

describe('Component: PlayerPage', () => {
  const mockedUseFilm = vi.mocked(useFilm);
  const mockFilm = getMockPageFilm();

  const { withHistoryComponent } = withHistory(
    <Routes>
      <Route path={AppRoute.Player} element={<PlayerPage />} />
    </Routes>,
    generatePath(AppRoute.Player, { id: mockFilm.id })
  );
  const { withStoreComponent } = withStore(withHistoryComponent);

  beforeEach(() => vi.clearAllMocks());

  it('should render PlayerPageContent when hook returns film data', () => {
    mockedUseFilm.mockReturnValue({
      data: mockFilm,
      isLoading: false,
      isLoaded: true,
      isLoadFailed: false,
      isNotFound: false,
    });

    render(withStoreComponent);

    expect(PlayerPageContent).toHaveBeenCalledOnce();
    expect(PlayerPageContent).toHaveBeenCalledWith(
      { film: mockFilm },
      expect.anything()
    );
    expect(LoadingPage).not.toHaveBeenCalled();
    expect(ErrorPage).not.toHaveBeenCalled();
    expect(NotFoundPage).not.toHaveBeenCalled();
  });

  it('should render ErrorPage when hook returns load error without 404 status', () => {
    mockedUseFilm.mockReturnValue({
      data: null,
      isLoading: false,
      isLoaded: false,
      isLoadFailed: true,
      isNotFound: false,
    });

    render(withStoreComponent);

    expect(ErrorPage).toHaveBeenCalledOnce();
    expect(ErrorPage).toHaveBeenCalledWith(
      {
        title: PageTitle.Player,
        text: 'We couldn\'t load the film. Please try again later.',
        onRetryButtonClick: expect.any(Function) as unknown as () => void,
      },
      expect.anything()
    );
    expect(LoadingPage).not.toHaveBeenCalled();
    expect(PlayerPageContent).not.toHaveBeenCalled();
    expect(NotFoundPage).not.toHaveBeenCalled();
  });

  it('should render NotFoundPage when hook returns 404 error', () => {
    mockedUseFilm.mockReturnValue({
      data: null,
      isLoading: false,
      isLoaded: false,
      isLoadFailed: true,
      isNotFound: true,
    });

    render(withStoreComponent);

    expect(NotFoundPage).toHaveBeenCalledOnce();
    expect(PlayerPageContent).not.toHaveBeenCalled();
    expect(LoadingPage).not.toHaveBeenCalled();
    expect(ErrorPage).not.toHaveBeenCalled();
  });

  it.each([
    {
      data: null,
      isLoading: false,
      isLoaded: false,
      isLoadFailed: false,
      isNotFound: false,
    },
    {
      data: null,
      isLoading: true,
      isLoaded: false,
      isLoadFailed: false,
      isNotFound: false,
    }
  ])('should render LoadingPage when hook returns returns no data and error', (returnValue) => {
    mockedUseFilm.mockReturnValue(returnValue);

    render(withStoreComponent);

    expect(LoadingPage).toHaveBeenCalledOnce();
    expect(PlayerPageContent).not.toHaveBeenCalled();
    expect(NotFoundPage).not.toHaveBeenCalled();
    expect(ErrorPage).not.toHaveBeenCalled();
  });
});
