import { generatePath } from 'react-router-dom';
import { screen, render, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute } from '../../const';
import { VideoProps } from '../video';
import { getMockPromoFilm } from '../../mocks/data';
import { withHistory, withStore } from '../../tests/render-helpers';
import { playerSelectors } from '../../store/player/player.selectors';
import ProgressBar from '../progress-bar';

import Player from './player';

vi.mock('../progress-bar', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/player/player.selectors', () => ({
  playerSelectors: {
    duration: vi.fn(),
    userSelectedTime: vi.fn(() => 0),
    remainingTime: vi.fn(),
    playbackProgress: vi.fn(),
  }
}));

describe('Copmonent: Player', () => {
  const mockFilm = getMockPromoFilm();
  const mockRenderVideo = vi.fn<(props: VideoProps) => JSX.Element>();

  const renderComponent = (previousPage: string = AppRoute.Root) => {
    const { withHistoryComponent } = withHistory(
      <Player film={mockFilm} previousPage={previousPage} renderVideo={mockRenderVideo} />
    );
    const { withStoreComponent } = withStore(withHistoryComponent);

    render(withStoreComponent);
  };

  beforeEach(() => vi.clearAllMocks());

  it('should render correctly', () => {
    renderComponent();
    const closePlayerButton = screen.getByRole('link', { name: 'Exit' });

    expect(closePlayerButton).toBeInTheDocument();
    expect(screen.getByText(mockFilm.name)).toBeInTheDocument();
    expect(ProgressBar).toHaveBeenCalledOnce();
    expect(mockRenderVideo).toHaveBeenCalledOnce();
    expect(mockRenderVideo).toHaveBeenCalledWith({
      src: mockFilm.videoLink,
      startTime: 0,
      isPlaying: true,
      onLoadedMetadata: expect.any(Function) as unknown as () => void,
      onTimeUpdate: expect.any(Function) as unknown as () => void,
      onEnded: expect.any(Function) as unknown as () => void,
      onPlaybackError: expect.any(Function) as unknown as () => void,
    });
  });

  it.each([
    0, 10, 100
  ])('should start playing from user selected time (%i)', (time) => {
    vi.mocked(playerSelectors).userSelectedTime.mockReturnValue(time);

    renderComponent();

    expect(mockRenderVideo).toHaveBeenCalledOnce();
    expect(mockRenderVideo).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: time,
      })
    );
  });

  it.each([
    AppRoute.Root,
    generatePath(AppRoute.Film, { id: mockFilm.id })
  ])('should pass previousPage prop value to close button href attribute', (previousPage) => {
    renderComponent(previousPage);
    const closePlayerButton = screen.getByRole('link', { name: 'Exit' });

    expect(closePlayerButton).toHaveAttribute('href', previousPage);
  });

  describe('play/pause', () => {
    enum ButtonText {
      Play = 'Play',
      Pause = 'Pause',
    }
    enum ButtonIconTestId {
      Play = 'play-icon',
      Pause = 'pause-icon',
    }

    const assertButtonPlayState = (buttonElement: HTMLElement) => {
      expect(buttonElement).toHaveTextContent(ButtonText.Play);
      expect(within(buttonElement).getByTestId(ButtonIconTestId.Play)).toBeInTheDocument();

      expect(buttonElement).not.toHaveTextContent(ButtonText.Pause);
      expect(within(buttonElement).queryByTestId(ButtonIconTestId.Pause)).not.toBeInTheDocument();
    };

    const assertButtonPauseState = (buttonElement: HTMLElement) => {
      expect(buttonElement).toHaveTextContent(ButtonText.Pause);
      expect(within(buttonElement).getByTestId(ButtonIconTestId.Pause)).toBeInTheDocument();

      expect(buttonElement).not.toHaveTextContent(ButtonText.Play);
      expect(within(buttonElement).queryByTestId(ButtonIconTestId.Play)).not.toBeInTheDocument();
    };

    it('should set isPlaying to true on mount', () => {
      renderComponent();
      const buttonElement = screen.getByRole('button', { name: ButtonText.Pause });

      expect(mockRenderVideo).toHaveBeenCalledOnce();
      expect(mockRenderVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          isPlaying: true,
        })
      );
      assertButtonPauseState(buttonElement);
    });

    it('should toggle isPlaying when button clicked', async () => {
      const user = userEvent.setup();

      renderComponent();
      const buttonElement = screen.getByRole('button', { name: ButtonText.Pause });
      await user.click(buttonElement);

      expect(mockRenderVideo).toHaveBeenCalledTimes(2);
      expect(mockRenderVideo).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPlaying: false
        })
      );
      assertButtonPlayState(buttonElement);

      await user.click(buttonElement);

      expect(mockRenderVideo).toHaveBeenCalledTimes(3);
      expect(mockRenderVideo).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPlaying: true
        })
      );
      assertButtonPauseState(buttonElement);
    });

    it('should set isPlaying to false when video ended', () => {
      renderComponent();
      const buttonElement = screen.getByRole('button', { name: ButtonText.Pause });
      const [renderVideoArguments] = mockRenderVideo.mock.calls[0];
      act(() => renderVideoArguments.onEnded!());

      expect(mockRenderVideo).toHaveBeenCalledTimes(2);
      expect(mockRenderVideo).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPlaying: false
        })
      );
      assertButtonPlayState(buttonElement);
    });

    it('should set isPlaying to false when playback player occurs', () => {
      renderComponent();
      const buttonElement = screen.getByRole('button', { name: ButtonText.Pause });
      const [renderVideoArguments] = mockRenderVideo.mock.calls[0];
      act(() => renderVideoArguments.onPlaybackError!());

      expect(mockRenderVideo).toHaveBeenCalledTimes(2);
      expect(mockRenderVideo).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isPlaying: false
        })
      );
      assertButtonPlayState(buttonElement);
    });
  });

  describe('fullscreen', () => {
    it('should enter fullscreen when button clicked and no fullscreenelement', async () => {
      const mockRequestFullscreen = vi.fn();
      Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true });
      Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { value: mockRequestFullscreen });
      const user = userEvent.setup();

      renderComponent();
      const buttonElement = screen.getByRole('button', { name: 'Full screen' });
      await user.click(buttonElement);

      expect(mockRequestFullscreen).toHaveBeenCalled();
    });

    it('should exit fullsreen when button clicked and fullscreenElement exists', async () => {
      const mockExitFullscreen = vi.fn();
      Object.defineProperty(document, 'fullscreenElement', { value: {}, configurable: true });
      Object.defineProperty(document, 'exitFullscreen', { value: mockExitFullscreen });
      const user = userEvent.setup();

      renderComponent();
      const buttonElement = screen.getByRole('button', { name: 'Full screen' });
      await user.click(buttonElement);

      expect(mockExitFullscreen).toHaveBeenCalled();
    });
  });
});
