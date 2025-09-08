import { formatPlaybackDuration } from './format-playback-duration';

describe('Function: formatPlaybackDuration', () => {
  describe('Format MM:SS when duration is up to 1 hour', () => {
    it.each([
      ['00:00', 0],
      ['00:01', 1],
      ['00:30', 30],
      ['00:59', 59],
      ['01:00', 60],
      ['01:01', 61],
      ['01:59', 119],
      ['02:00', 120],
      ['59:59', 3599],
    ])('should return "%s" when duration is %i seconds', (expectedString, duration) => {
      expect(formatPlaybackDuration(duration)).toBe(expectedString);
    });
  });

  describe('Format HH:MM:SS when duration is from 1 hour', () => {
    it.each([
      ['01:00:00', 3600],
      ['01:00:01', 3601],
      ['01:01:00', 3660],
      ['02:02:02', 7322],
      ['59:59:59', 215999],
      ['60:00:00', 216000],
      ['72:45:30', 261930],
    ])('should return "%s" when duration is %i seconds', (expectedString, duration) => {
      expect(formatPlaybackDuration(duration)).toBe(expectedString);
    });
  });
});
