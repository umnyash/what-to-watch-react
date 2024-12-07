import { useState, useRef, useEffect } from 'react';

type VideoProps = {
  src: string;
  isPlaying?: boolean;
  muted?: boolean;
  loop?: boolean;
}

function Video(props: VideoProps): JSX.Element {
  const { isPlaying, ...restProps } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleDataLoaded = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!isLoaded || !videoElement) {
      return;
    }

    if (isPlaying) {
      videoElement.play();
      return;
    }

    videoElement.pause();
  }, [isPlaying, isLoaded]);

  return (
    <video
      className="player__video"
      {...restProps}
      ref={videoRef}
      onLoadedData={handleDataLoaded}
    />
  );
}

export default Video;
