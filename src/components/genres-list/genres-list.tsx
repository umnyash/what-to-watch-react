import { MouseEvent } from 'react';
import useAppSelector from '../../hooks/use-app-selector';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { catalogActions } from '../../store/catalog/catalog.slice';
import clsx from 'clsx';
import { ALL_GENRES } from '../../const';

function getItemClassName(genre: string, activeGenre: string) {
  return clsx(
    'catalog__genres-item',
    activeGenre === genre && 'catalog__genres-item--active'
  );
}

function GenresList(): JSX.Element {
  const genres = useAppSelector(catalogSelectors.topGenres);
  const activeGenre = useAppSelector(catalogSelectors.activeGenre);

  const dispatch = useAppDispatch();

  function getGenreClickHandler(genre: string) {
    return (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      dispatch(catalogActions.setGenre(genre));
      dispatch(catalogActions.resetDisplayedFilmsMaxCount());
    };
  }

  return (
    <ul className="catalog__genres-list">
      <li className={getItemClassName(ALL_GENRES, activeGenre)}>
        <a
          className="catalog__genres-link"
          href="#"
          onClick={getGenreClickHandler(ALL_GENRES)}
        >
          All genres
        </a>
      </li>

      {genres.map((genre) => (
        <li className={getItemClassName(genre, activeGenre)} key={genre}>
          <a
            className="catalog__genres-link"
            href="#"
            onClick={getGenreClickHandler(genre)}
          >
            {genre}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default GenresList;
