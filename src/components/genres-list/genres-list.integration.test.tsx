import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FILMS_PER_LOAD, RequestStatus, SliceName } from '../../const';
import { MockGenre, getMockCardFilm } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';

import GenresList from './genres-list';

describe('Component: GenresList (integration)', () => {
  const genres = [MockGenre.Adventure, MockGenre.Comedy];
  const mockFilms = genres.map((genre) => getMockCardFilm({ genre }));

  const genreResetButton = {
    text: 'All genres',
    value: null,
  };

  it.each([
    [genres[1], genreResetButton.text, null],
    [null, genres[0], genres[0]],
    [genres[0], genres[1], genres[1]],
  ])(
    'should set genre filter and reset displayedFilmsMaxCount when clicking inactive button',
    async (currentGenre, targetGenreButtonText, targetGenre) => {
      const { withStoreComponent, store } = withStore(<GenresList />, {
        [SliceName.Catalog]: {
          films: mockFilms,
          filmsLoadingStatus: RequestStatus.Success,
          filter: { genre: currentGenre },
          displayedFilmsMaxCount: FILMS_PER_LOAD * 3,
        }
      });
      const user = userEvent.setup();

      render(withStoreComponent);
      await user.click(screen.getByRole('link', { name: targetGenreButtonText }));

      expect(store.getState()[SliceName.Catalog]).toMatchObject({
        filter: { genre: targetGenre },
        displayedFilmsMaxCount: FILMS_PER_LOAD,
      });
    }
  );

  it.each([
    [genreResetButton.value, genreResetButton.text],
    [genres[0], genres[0]],
    [genres[1], genres[1]],
  ])(
    'should not dispatch any actions when clicking already active button',
    async (currentGenre, currentGenreButtonText) => {
      const { withStoreComponent, store } = withStore(<GenresList />, {
        [SliceName.Catalog]: {
          films: mockFilms,
          filmsLoadingStatus: RequestStatus.Success,
          filter: { genre: currentGenre },
          displayedFilmsMaxCount: FILMS_PER_LOAD,
        }
      });
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const user = userEvent.setup();

      render(withStoreComponent);
      await user.click(screen.getByText(currentGenreButtonText));

      expect(dispatchSpy).not.toHaveBeenCalled();
    }
  );
});
