import { useState, useRef, useEffect, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import useAppSelector from '../../hooks/use-app-selector';
import { playerSelectors } from '../../store/player/player.selectors';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { playerActions } from '../../store/player/player.slice';
import { PromoFilm, PageFilm } from '../../types/films';
import { VideoProps } from '../video/types';
import style from './player.module.css';
import ProgressBar from '../progress-bar';

type PlayerProps = {
  film: PromoFilm | PageFilm;
  previousPage: string;
  renderVideo: (options: VideoProps) => JSX.Element;
}

function Player({ film, previousPage, renderVideo }: PlayerProps) {
  const { name, videoLink } = film;
  const playerElementRef = useRef<HTMLDivElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const userSelectedTime = useAppSelector(playerSelectors.userSelectedTime);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(playerActions.resetPlayback());
  }, [dispatch]);

  const handlePlayButtonClick = () => {
    setIsVideoPlaying((prevState) => !prevState);
  };

  const handleFullscreenButtonClick = () => {
    if (!document.fullscreenElement) {
      playerElementRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleVideoLoadedMetadata = (evt: SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = evt.target as HTMLVideoElement;
    dispatch(playerActions.setDuration(videoElement.duration));
  };

  const handleVideoTimeUpdate = (evt: SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = evt.target as HTMLVideoElement;
    dispatch(playerActions.setCurrentTime(videoElement.currentTime));
  };

  const handlePlaybackError = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className={`player ${style.player}`} ref={playerElementRef}>
      {renderVideo({
        src: videoLink,
        startTime: userSelectedTime,
        isPlaying: isVideoPlaying,
        onLoadedMetadata: handleVideoLoadedMetadata,
        onTimeUpdate: handleVideoTimeUpdate,
        onEnded: handleVideoEnded,
        onPlaybackError: handlePlaybackError,
      })}

      <Link
        className="player__exit"
        to={previousPage}
        style={{ textDecoration: 'none' }}
      >
        Exit
      </Link>

      <div className="player__controls">
        <ProgressBar />

        <div className="player__controls-row">
          <button
            type="button"
            className="player__play"
            onClick={handlePlayButtonClick}
          >
            {isVideoPlaying ? (
              <svg viewBox="0 0 14 21" width="14" height="21">
                <use xlinkHref="#pause"></use>
              </svg>
            ) : (
              <svg viewBox="0 0 19 19" width="19" height="19">
                <use xlinkHref="#play-s" />
              </svg>
            )}
            <span>{isVideoPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <div className="player__name">{name}</div>

          <button type="button" className="player__full-screen" onClick={handleFullscreenButtonClick}>
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
