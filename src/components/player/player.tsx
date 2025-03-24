import { useState, useRef, SyntheticEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { PromoFilm, PageFilm } from '../../types/films';
import { VideoProps } from '../video/types';
import { formatPlaybackDuration } from '../../util';

const SMALL_TIME_SHIFT = 0.001;

type PlayerProps = {
  film: PromoFilm | PageFilm;
  previousPage: string;
  renderVideo: (options: VideoProps) => JSX.Element;
}

function Player({ film, previousPage, renderVideo }: PlayerProps) {
  const { name, videoLink } = film;
  const playerElementRef = useRef<HTMLDivElement | null>(null);
  const progressBarElementRef = useRef<HTMLProgressElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userSelectedTime, setUserSelectedTime] = useState(0);

  const remainingTime = formatPlaybackDuration(duration - currentTime);
  const playbackProgress = (100 / duration * currentTime) || 0;

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

  const handleProgressBarClick = (evt: MouseEvent<HTMLProgressElement>) => {
    if (!progressBarElementRef.current) {
      return;
    }

    const { width, left } = progressBarElementRef.current.getBoundingClientRect();
    const offsetX = evt.clientX - left;
    const time = offsetX / width * duration;
    setUserSelectedTime((prevTime) => prevTime === time ? time + SMALL_TIME_SHIFT : time);
  };

  const handleVideoLoadedMetadata = (evt: SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = evt.target as HTMLVideoElement;
    setDuration(videoElement.duration);
  };

  const handleVideoTimeUpdate = (evt: SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = evt.target as HTMLVideoElement;
    setCurrentTime(videoElement.currentTime);
  };

  const handlePlaybackError = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="player" ref={playerElementRef}>
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
        <div className="player__controls-row">
          <div className="player__time">
            <progress
              className="player__progress"
              ref={progressBarElementRef}
              value={playbackProgress}
              max="100"
              onClick={handleProgressBarClick}
            />
            <div className="player__toggler" style={{ left: `${playbackProgress}%` }}>Toggler</div>
          </div>
          <div className="player__time-value">{remainingTime}</div>
        </div>

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
