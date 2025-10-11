import { screen, render } from '@testing-library/react';

import { withStore } from '../../tests/render-helpers';
import { playerSelectors } from '../../store/player/player.selectors';

import ProgressBar from './progress-bar';

vi.mock('../../store/player/player.selectors', () => ({
  playerSelectors: {
    duration: vi.fn(),
    userSelectedTime: vi.fn(),
    remainingTime: vi.fn(),
    playbackProgress: vi.fn(),
  }
}));

describe('Component: ProgressBar', () => {
  const mockedSelectors = vi.mocked(playerSelectors);
  const thumbTestId = 'progress-bar-thumb';

  const { withStoreComponent } = withStore(<ProgressBar />);

  it.each([
    [0, '01:20:00'],
    [50, '40:00',],
    [100, '00:00'],
  ])('should render correctly', (playbackProgress, remainingTime) => {
    mockedSelectors.playbackProgress.mockReturnValue(playbackProgress);
    mockedSelectors.remainingTime.mockReturnValue(remainingTime);

    render(withStoreComponent);
    const progressElement: HTMLProgressElement = screen.getByRole('progressbar');
    const buttonElement = screen.getByTestId(thumbTestId);
    const remainingTimeElement = screen.getByText(`-${remainingTime}`);

    expect(progressElement.value).toBe(playbackProgress);
    expect(buttonElement).toHaveStyle({ left: `${playbackProgress}%` });
    expect(remainingTimeElement).toBeInTheDocument();
  });
});
