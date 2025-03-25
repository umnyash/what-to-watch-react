import { useRef, MouseEvent } from 'react';
import useAppSelector from '../../hooks/use-app-selector';
import { playerSelectors } from '../../store/player/player.selectors';
import useAppDispatch from '../../hooks/use-app-dispatch';
import { playerActions } from '../../store/player/player.slice';

const SMALL_TIME_SHIFT = 0.001;

function ProgressBar() {
  const progressBarElementRef = useRef<HTMLProgressElement | null>(null);

  const duration = useAppSelector(playerSelectors.duration);
  const userSelectedTime = useAppSelector(playerSelectors.userSelectedTime);
  const remainingTime = useAppSelector(playerSelectors.remainingTime);
  const playbackProgress = (useAppSelector(playerSelectors.playbackProgress));

  const dispatch = useAppDispatch();

  const handleProgressBarClick = (evt: MouseEvent<HTMLProgressElement>) => {
    if (!progressBarElementRef.current) {
      return;
    }

    const { width, left } = progressBarElementRef.current.getBoundingClientRect();
    const offsetX = evt.clientX - left;
    const time = offsetX / width * duration;
    dispatch(
      playerActions.setUserSelectedTime(userSelectedTime === time ? time + SMALL_TIME_SHIFT : time)
    );
  };

  return (
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
  );
}

export default ProgressBar;
