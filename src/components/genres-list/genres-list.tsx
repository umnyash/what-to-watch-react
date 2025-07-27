import { MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { catalogActions } from '../../store/catalog/catalog.slice';
import clsx from 'clsx';
import { CatalogState } from '../../types/state';

type GenreFilter = CatalogState['filter']['genre'];

type GenreListItemProps = {
  genre: GenreFilter;
  activeGenre: GenreFilter;
  onClick: (evt: MouseEvent<HTMLAnchorElement>) => void;
}

function GenreListItem({ genre, activeGenre, onClick }: GenreListItemProps): JSX.Element {
  const isActive = activeGenre ? activeGenre === genre : !genre;

  const className = clsx(
    'catalog__genres-item',
    isActive && 'catalog__genres-item--active'
  );

  return (
    <li className={className}>
      <a
        className="catalog__genres-link"
        {...(!isActive && { href: '#', onClick })}
      >
        {genre ?? 'All genres'}
      </a>
    </li>
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
      <GenreListItem genre={null} activeGenre={activeGenre} onClick={getGenreClickHandler(null)} />

      {genres.map((genre) => (
        <GenreListItem
          genre={genre}
          activeGenre={activeGenre}
          onClick={getGenreClickHandler(genre)}
          key={genre}
        />
      ))}
    </ul>
  );
}

export default GenresList;
