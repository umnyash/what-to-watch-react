import { SyntheticEvent } from 'react';

export type VideoProps = {
  src: string;
  startTime?: number;
  isPlaying?: boolean;
  muted?: boolean;
  loop?: boolean;
  onLoadedMetadata?: (evt: SyntheticEvent<HTMLVideoElement>) => void;
  onTimeUpdate?: (evt: SyntheticEvent<HTMLVideoElement>) => void;
  onEnded?: () => void;
  onPlaybackError?: () => void;
}
