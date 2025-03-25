import { useState, useEffect } from 'react';
import { AppRoute, ROUTE_PARAM_ID } from '../../const';
import { CardFilm } from '../../types/films';
import { Link } from 'react-router-dom';
import { VideoProps } from '../video';

import style from './film-card.module.css';

const DELAY_BEFORE_PLAY = 1000;

type FilmCardProps = {
  film: CardFilm;
  renderVideo: (options: VideoProps) => JSX.Element;
}

function FilmCard({ film, renderVideo }: FilmCardProps): JSX.Element {
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
          renderVideo({
            src: film.previewVideoLink,
            isPlaying: true,
            muted: true,
            loop: true
          })
        ) : (
          <img src={previewImage} width="280" height="175" alt={name} />
        )}
      </div>
      <h3 className={`small-film-card__title ${style.heading}`}>
        <Link className={`small-film-card__link ${style.link}`} to={link}>{name}</Link>
      </h3>
    </article>
  );
}

export default FilmCard;
