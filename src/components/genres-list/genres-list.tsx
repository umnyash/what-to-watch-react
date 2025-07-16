import { MouseEvent } from 'react';
import useAppSelector from '../../hooks/use-app-selector';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { catalogActions } from '../../store/catalog/catalog.slice';
import clsx from 'clsx';
import { CatalogState } from '../../types/state';

type GenreFilter = CatalogState['filter']['genre'];

function getItemClassName(genre: GenreFilter, activeGenre: GenreFilter) {
  return clsx(
    'catalog__genres-item',
    (activeGenre ? activeGenre === genre : !genre) && 'catalog__genres-item--active'
  );
}

function GenresList(): JSX.Element {
  const genres = useAppSelector(catalogSelectors.topGenres);
  const activeGenre = useAppSelector(catalogSelectors.genreFilter);

  const dispatch = useAppDispatch();

  function getGenreClickHandler(genre: GenreFilter) {
    return (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      dispatch(catalogActions.setGenreFilter(genre));
      dispatch(catalogActions.resetDisplayedFilmsMaxCount());
    };
  }

  return (
    <ul className="catalog__genres-list">
      <li className={getItemClassName(null, activeGenre)}>
        <a
          className="catalog__genres-link"
          href="#"
          onClick={getGenreClickHandler(null)}
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
