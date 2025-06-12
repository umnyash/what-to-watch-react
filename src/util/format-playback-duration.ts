import { SECONDS_PER_MINUTE, MINUTES_PER_HOUR } from '../const';

export const formatPlaybackDuration = (seconds: number) => {
  const secondsPerHour = MINUTES_PER_HOUR * SECONDS_PER_MINUTE;

  const hours = Math.floor(seconds / secondsPerHour);
  const remainingMinutes = Math.floor((seconds % secondsPerHour) / SECONDS_PER_MINUTE);
  const remainingSeconds = Math.floor(seconds % SECONDS_PER_MINUTE);

  const hoursString = hours ? `${hours}:` : '';
  const minutesString = `${remainingMinutes.toString().padStart(hours && 2, '0')}:`;
  const secondsString = remainingSeconds.toString().padStart(2, '0');

  return `${hoursString}${minutesString}${secondsString}`;
};
