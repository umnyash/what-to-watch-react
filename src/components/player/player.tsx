import { Link } from 'react-router-dom';
import { PromoFilm, PageFilm } from '../../types/films';
import { VideoProps } from '../video/types';

type PlayerProps = {
  film: PromoFilm | PageFilm;
  previousPage: string;
  renderVideo: (options: VideoProps) => JSX.Element;
}

function Player({ film, previousPage, renderVideo }: PlayerProps) {
  const { name, videoLink } = film;

  return (
    <div className="player">
      {renderVideo({
        src: videoLink,
        isPlaying: true,
      })}

      <Link
        className="player__exit"
        to={previousPage}
        style={{ textDecoration: 'none' }}
      >
        Exit
      </Link>

      <div className="player__controls">
        <div className="player__controls-row">
          <div className="player__time">
            <progress className="player__progress" value="30" max="100"></progress>
            <div className="player__toggler" style={{ left: '30%' }}>Toggler</div>
          </div>
          <div className="player__time-value">1:30:29</div>
        </div>

        <div className="player__controls-row">
          <button type="button" className="player__play">
            <svg viewBox="0 0 19 19" width="19" height="19">
              <use xlinkHref="#play-s" />
            </svg>
            <span>Play</span>
          </button>
          <div className="player__name">{name}</div>

          <button type="button" className="player__full-screen">
            <svg viewBox="0 0 27 27" width="27" height="27">
              <use xlinkHref="#full-screen" />
            </svg>
            <span>Full screen</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Player;
