import { ComponentType } from 'react';
import { generatePath } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { AppRoute, PageTitle } from '../../const';
import { getMockPromoFilm } from '../../mocks/data';
import { withHistory } from '../../tests/render-helpers';
import Player from '../player';
import withVideo from '../../hocs/with-video';

import PlayerPageContent from './player-page-content';

vi.mock('../player/player', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../hocs/with-video', () => ({
  default: vi.fn((Component: ComponentType) => Component)
}));

describe('Component: PlayerPageContent', () => {
  const mockFilm = getMockPromoFilm();
  const filmPagePath = generatePath(AppRoute.Film, { id: mockFilm.id });

  it('should render correctly', () => {
    const { withHistoryComponent } = withHistory(<PlayerPageContent film={mockFilm} />);

    render(withHistoryComponent);

    expect(withVideo).toHaveBeenCalledOnce();
    expect(withVideo).toHaveBeenCalledWith(Player);
    expect(Player).toHaveBeenCalledOnce();
  });

  it.each([
    [undefined, filmPagePath],
    [{ from: AppRoute.Root }, AppRoute.Root]
  ])('should call player with correct props', (state, previousPage) => {
    const { withHistoryComponent } = withHistory(
      <PlayerPageContent film={mockFilm} />,
      AppRoute.Player,
      state
    );

    render(withHistoryComponent);

    expect(Player).toHaveBeenCalledWith({
      film: mockFilm,
      previousPage,
    }, expect.anything());
  });

  it('should set page title correctly', async () => {
    const { withHistoryComponent } = withHistory(<PlayerPageContent film={mockFilm} />);
    render(withHistoryComponent);
    await waitFor(() => expect(document.title).toBe(PageTitle.Player));
  });
});
