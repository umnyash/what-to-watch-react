import { Films as FilmsData } from '../../types/films';
import FilmsList from '../films-list';

type FilmsProps = {
  heading: string;
  films: FilmsData;
}

function Films({ heading, films }: FilmsProps): JSX.Element {
  return (
    <section className="catalog catalog--like-this">
      <h2 className="catalog__title">{heading}</h2>
      <FilmsList films={films} />
    </section>
  );
}

export default Films;
