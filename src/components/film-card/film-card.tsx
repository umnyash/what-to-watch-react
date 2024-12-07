import { useState, useEffect } from 'react';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';
import { CardFilm } from '../../types/films';
import { Link } from 'react-router-dom';
import Video from '../video';

const DELAY_BEFORE_PLAY = 1000;

type FilmCardProps = {
  film: CardFilm;
}

function FilmCard({ film }: FilmCardProps): JSX.Element {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { id, name, previewImage } = film;
  const link = AppRoute.Film.replace(ROUTE_PARAM_ID, id);

  useEffect(() => {
    if (!isMouseOver) {
      return;
    }

    const timerId = setTimeout(() => {
      setIsVideoPlaying(true);
    }, DELAY_BEFORE_PLAY);

    return () => {
      clearTimeout(timerId);
      setIsVideoPlaying(false);
    };
  }, [isMouseOver]);


  return (
    <article
      className="small-film-card catalog__films-card"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <div className="small-film-card__image">
        {isVideoPlaying ? (
          <Video src={film.previewVideoLink} isPlaying muted loop />
        ) : (
          <img src={previewImage} width="280" height="175" alt={name} />
        )}
      </div>
      <h3 className="small-film-card__title">
        <Link className="small-film-card__link" to={link}>{name}</Link>
      </h3>
    </article>
  );
}

export default FilmCard;
