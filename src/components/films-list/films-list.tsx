import FilmCard from '../film-card';
import { Films } from '../../types/films';
import withVideo from '../../hocs/with-video/with-video';

const FilmCardWrapped = withVideo(FilmCard);

type FilmsListProps = {
  films: Films;
}

function FilmsList({ films }: FilmsListProps): JSX.Element {
  return (
    <div className="catalog__films-list">
      {films.map((film) => <FilmCardWrapped film={film} key={film.id} />)}
    </div>
  );
}

export default FilmsList;
