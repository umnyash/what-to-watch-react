import { MouseEvent } from 'react';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { setGenre } from '../../store/action';
import { FilmsByGenre } from '../../types/films';
import clsx from 'clsx';
import { ALL_GENRES, GENRES_MAX_COUNT } from '../../const';

type GenresListProps = {
  activeGenre: string;
  filmsByGenre: FilmsByGenre;
  onGenreClick: () => void;
}

function getTopGenres(filmsByGenre: FilmsByGenre) {
  return Object
    .entries(filmsByGenre)
    .sort(([, filmsA], [, filmsB]) => filmsB.length - filmsA.length)
    .slice(0, GENRES_MAX_COUNT)
    .map(([genre]) => genre);
}

function getItemClassName(genre: string, activeGenre: string) {
  return clsx(
    'catalog__genres-item',
    activeGenre === genre && 'catalog__genres-item--active'
  );
}

function GenresList({ activeGenre, filmsByGenre, onGenreClick }: GenresListProps): JSX.Element {
  const genres = getTopGenres(filmsByGenre);

  const dispatch = useAppDispatch();

  function getGenreClickHandler(genre: string) {
    return (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      dispatch(setGenre(genre));
      onGenreClick();
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
