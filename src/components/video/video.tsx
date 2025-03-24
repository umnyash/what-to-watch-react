import { useState, useRef, useEffect } from 'react';
import { VideoProps } from './types';

function Video(props: VideoProps): JSX.Element {
  const { isPlaying, startTime, onPlaybackError, ...restProps } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!isLoaded || !videoElement) {
      return;
    }

    videoElement.currentTime = startTime || 0;
  }, [isLoaded, startTime]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!isLoaded || !videoElement) {
      return;
    }

    if (isPlaying) {
      videoElement.play().catch(() => {
        onPlaybackError?.();
      });

      return;
    }

    videoElement.pause();
  }, [isLoaded, isPlaying, onPlaybackError]);

  return (
    <video
      className="player__video"
      {...restProps}
      ref={videoRef}
      onLoadedData={() => setIsLoaded(true)}
    />
  );
}

export default Video;
