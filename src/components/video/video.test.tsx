import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import Video from './video';

describe('Component: Video', () => {
  const videoTestId = 'video';
  const mockVideoPath = faker.internet.url();
  const mockPlay = vi.fn().mockRejectedValue(new Error('Play failed'));
  const mockPause = vi.fn();
  HTMLMediaElement.prototype.play = mockPlay;
  HTMLMediaElement.prototype.pause = mockPause;

  beforeEach(() => vi.clearAllMocks());

  it('renders video with source', () => {
    render(<Video src={mockVideoPath} />);
    const videoElement = screen.getByTestId(videoTestId);

    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('src', mockVideoPath);
  });

  describe('loop prop', () => {
    it('does not add loop attribute by default', () => {
      render(<Video src={mockVideoPath} />);
      const videoElement = screen.getByTestId(videoTestId);

      expect(videoElement).not.toHaveAttribute('loop');
    });

    it('adds loop attribute when provided', () => {
      render(<Video src={mockVideoPath} loop />);
      const videoElement = screen.getByTestId(videoTestId);

      expect(videoElement).toHaveAttribute('loop');
    });
  });

  describe('muted prop', () => {
    it('is not muted by default', () => {
      render(<Video src={mockVideoPath} />);
      const videoElement: HTMLVideoElement = screen.getByTestId(videoTestId);

      expect(videoElement.muted).toBe(false);
    });

    it('is muted when provided', () => {
      render(<Video src={mockVideoPath} muted />);
      const videoElement: HTMLVideoElement = screen.getByTestId(videoTestId);

      expect(videoElement.muted).toBe(true);
    });
  });

  describe('startTime prop', () => {
    it('sets currentTime to 0 by default', () => {
      render(<Video src={mockVideoPath} />);
      const videoElement: HTMLVideoElement = screen.getByTestId(videoTestId);

      expect(videoElement.currentTime).toBe(0);
    });

    it('safely handles startTime before video loading', () => {
      render(<Video src={mockVideoPath} startTime={20} />);
      const videoElement: HTMLVideoElement = screen.getByTestId(videoTestId);

      expect(videoElement.currentTime).toBe(0);
    });

    it('applies startTime when video loads', () => {
      const expectedCurrentTime = 20;

      render(<Video src={mockVideoPath} startTime={expectedCurrentTime} />);
      const videoElement: HTMLVideoElement = screen.getByTestId(videoTestId);
      fireEvent(videoElement, new Event('loadeddata'));

      expect(videoElement.currentTime).toBe(expectedCurrentTime);
    });

    it('updates currentTime when startTime changes after loading', () => {
      const expectedCurrentTime = 100;

      const { rerender } = render(<Video src={mockVideoPath} startTime={20} />);
      const videoElement: HTMLVideoElement = screen.getByTestId(videoTestId);
      fireEvent(videoElement, new Event('loadeddata'));
      rerender(<Video src={mockVideoPath} startTime={expectedCurrentTime} />);

      expect(videoElement.currentTime).toBe(expectedCurrentTime);
    });
  });

  describe('isPlaying prop', () => {
    it.each([
      undefined,
      false,
      true,
    ])('safely handles isPlaying before video loading', (isPlaying) => {
      render(<Video src={mockVideoPath} isPlaying={isPlaying} />);

      expect(mockPlay).not.toHaveBeenCalled();
      expect(mockPause).not.toHaveBeenCalled();
    });

    describe('when video is loaded', () => {
      it('pauses by default', () => {
        render(<Video src={mockVideoPath} />);
        const videoElement = screen.getByTestId(videoTestId);
        fireEvent(videoElement, new Event('loadeddata'));

        expect(mockPause).toHaveBeenCalledOnce();
        expect(mockPlay).not.toHaveBeenCalled();
      });

      it('plays when isPlaying true', () => {
        render(<Video src={mockVideoPath} isPlaying />);
        const videoElement = screen.getByTestId(videoTestId);
        fireEvent(videoElement, new Event('loadeddata'));

        expect(mockPlay).toHaveBeenCalledOnce();
        expect(mockPause).not.toHaveBeenCalled();
      });

      it('toggles play/pause on isPlaying change', () => {
        const { rerender } = render(<Video src={mockVideoPath} isPlaying />);
        const videoElement = screen.getByTestId(videoTestId);
        fireEvent(videoElement, new Event('loadeddata'));
        rerender(<Video src={mockVideoPath} />);
        rerender(<Video src={mockVideoPath} isPlaying />);
        rerender(<Video src={mockVideoPath} />);

        expect(mockPlay).toHaveBeenCalledTimes(2);
        expect(mockPause).toHaveBeenCalledTimes(2);
      });
    });
  });

  it('calls onPlaybackError callback when play fails', async () => {
    const handleVideoPlaybackError = vi.fn();

    render(<Video src={mockVideoPath} isPlaying onPlaybackError={handleVideoPlaybackError} />);
    const videoElement = screen.getByTestId(videoTestId);
    fireEvent(videoElement, new Event('loadeddata'));

    await waitFor(() => {
      expect(handleVideoPlaybackError).toHaveBeenCalledOnce();
    });
  });

  it('calls onLoadedMetadata callback when metadata is loaded', () => {
    const handleVideoLoadedMetadata = vi.fn();

    render(<Video src={mockVideoPath} onLoadedMetadata={handleVideoLoadedMetadata} />);
    const videoElement = screen.getByTestId(videoTestId);
    fireEvent(videoElement, new Event('loadedmetadata'));

    expect(handleVideoLoadedMetadata).toHaveBeenCalledOnce();
  });

  it('calls onTimeUpdate callback when time updates', () => {
    const handleVideoTimeUpdate = vi.fn();

    render(<Video src={mockVideoPath} onTimeUpdate={handleVideoTimeUpdate} />);
    const videoElement = screen.getByTestId(videoTestId);
    fireEvent(videoElement, new Event('timeupdate'));

    expect(handleVideoTimeUpdate).toHaveBeenCalledOnce();
  });

  it('calls onEnded callback when video ends', () => {
    const handleVideoEnded = vi.fn();

    render(<Video src={mockVideoPath} onEnded={handleVideoEnded} />);
    const videoElement = screen.getByTestId(videoTestId);
    fireEvent(videoElement, new Event('ended'));

    expect(handleVideoEnded).toHaveBeenCalledOnce();
  });
});
