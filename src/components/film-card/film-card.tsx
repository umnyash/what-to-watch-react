import { CardFilm } from '../../types/films';

type FilmCardProps = {
  film: CardFilm;
}

function FilmCard({ film }: FilmCardProps): JSX.Element {
  const { name, previewImage } = film;

  return (
    <article className="small-film-card catalog__films-card">
      <div className="small-film-card__image">
        <img src={previewImage} width="280" height="175" alt={name} />
      </div>
      <h3 className="small-film-card__title">
        <a className="small-film-card__link" href="film-page.html">{name}</a>
      </h3>
    </article>
  );
}

export default FilmCard;
