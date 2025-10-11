import { generatePath } from 'react-router-dom';
import { screen, render, fireEvent, act } from '@testing-library/react';

import { AppRoute } from '../../const';
import { getMockCardFilm } from '../../mocks/data';
import { withHistory } from '../../tests/render-helpers';

import FilmCard from './film-card';

describe('Component: FilmCard', () => {
  const mockFilm = getMockCardFilm();
  const mockRenderVideo = vi.fn();
  const { withHistoryComponent } = withHistory(
    <FilmCard film={mockFilm} renderVideo={mockRenderVideo} />
  );

  const assertRenderVideoCalledCorrectly = () => {
    expect(mockRenderVideo).toHaveBeenCalledOnce();
    expect(mockRenderVideo).toHaveBeenCalledWith({
      src: mockFilm.previewVideoLink,
      isPlaying: true,
      muted: true,
      loop: true
    });
  };

  beforeEach(() => vi.clearAllMocks());

  it('should render correctly', () => {
    const filmPath = generatePath(AppRoute.Film, { id: mockFilm.id });

    render(withHistoryComponent);
    const cardElement = screen.getByRole('article');
    const headingElement = screen.getByRole('heading', { level: 3, name: mockFilm.name });
    const linkElement = screen.getByRole('link', { name: mockFilm.name });
    const previewImageElement = screen.getByAltText(mockFilm.name);

    expect(cardElement).toBeInTheDocument();
    expect(headingElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', filmPath);
    expect(previewImageElement).toHaveAttribute('src', mockFilm.previewImage);
    expect(mockRenderVideo).not.toHaveBeenCalled();
  });

  describe('video playback', () => {
    const DELAY_BEFORE_PLAY = 1000;
    vi.useFakeTimers();

    it('should replace preview image with video after hover delay', () => {
      render(withHistoryComponent);
      const cardElement = screen.getByRole('article');
      fireEvent.mouseOver(cardElement);
      act(() => vi.advanceTimersByTime(DELAY_BEFORE_PLAY));

      expect(screen.queryByAltText(mockFilm.name)).not.toBeInTheDocument();
      assertRenderVideoCalledCorrectly();
    });

    it('should keep preview image before hover delay completes', () => {
      render(withHistoryComponent);
      const cardElement = screen.getByRole('article');
      fireEvent.mouseOver(cardElement);
      act(() => vi.advanceTimersByTime(DELAY_BEFORE_PLAY - 1));

      expect(screen.getByAltText(mockFilm.name)).toBeInTheDocument();
      expect(mockRenderVideo).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(1));

      expect(screen.queryByAltText(mockFilm.name)).not.toBeInTheDocument();
      assertRenderVideoCalledCorrectly();
    });

    it('should prevent video replacement when mouse leaves before delay', () => {
      render(withHistoryComponent);
      const cardElement = screen.getByRole('article');
      fireEvent.mouseOver(cardElement);
      act(() => vi.advanceTimersByTime(DELAY_BEFORE_PLAY - 1));
      fireEvent.mouseOut(cardElement);
      act(() => vi.advanceTimersByTime(1));

      expect(screen.getByAltText(mockFilm.name)).toBeInTheDocument();
      expect(mockRenderVideo).not.toHaveBeenCalled();
    });

    it('should reset delay timer on repeated hover events', () => {
      render(withHistoryComponent);
      const cardElement = screen.getByRole('article');
      fireEvent.mouseOver(cardElement);
      act(() => vi.advanceTimersByTime(DELAY_BEFORE_PLAY - 1));
      fireEvent.mouseOut(cardElement);
      fireEvent.mouseOver(cardElement);
      act(() => vi.advanceTimersByTime(DELAY_BEFORE_PLAY - 1));

      expect(screen.getByAltText(mockFilm.name)).toBeInTheDocument();
      expect(mockRenderVideo).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(1));

      expect(screen.queryByAltText(mockFilm.name)).not.toBeInTheDocument();
      assertRenderVideoCalledCorrectly();
    });

    it('should replace video with preview image when mouse leaves', () => {
      render(withHistoryComponent);
      const cardElement = screen.getByRole('article');
      fireEvent.mouseOver(cardElement);
      act(() => vi.advanceTimersByTime(DELAY_BEFORE_PLAY));

      expect(screen.queryByAltText(mockFilm.name)).not.toBeInTheDocument();
      assertRenderVideoCalledCorrectly();

      fireEvent.mouseOut(cardElement);

      expect(screen.getByAltText(mockFilm.name)).toBeInTheDocument();
      assertRenderVideoCalledCorrectly();
    });
  });
});
