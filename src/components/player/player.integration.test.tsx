import { SyntheticEvent } from 'react';
import { render, act } from '@testing-library/react';

import { AppRoute, SliceName } from '../../const';
import { VideoProps } from '../video';
import { getMockPromoFilm } from '../../mocks/data';
import { extractActionsTypes } from '../../tests/util';
import { withHistory, withStore } from '../../tests/render-helpers';
import { playerActions } from '../../store/player/player.slice';

import Player from './player';

describe('Component: Player (integration)', () => {
  const sliceName = SliceName.Player;
  const mockFilm = getMockPromoFilm();
  const mockRenderVideo = vi.fn<(props: VideoProps) => JSX.Element>();

  const { withHistoryComponent } = withHistory(
    <Player film={mockFilm} previousPage={AppRoute.Root} renderVideo={mockRenderVideo} />
  );

  beforeEach(() => vi.clearAllMocks());

  it(`should dispatch ${playerActions.setDuration.type} action on video loaded metadata`, () => {
    const mockVideoElement = { duration: 100 };
    const mockEvent = { target: mockVideoElement };
    const { withStoreComponent, store } = withStore(withHistoryComponent);

    render(withStoreComponent);
    const [renderVideoArguments] = mockRenderVideo.mock.calls[0];
    act(() => renderVideoArguments.onLoadedMetadata!(mockEvent as unknown as SyntheticEvent<HTMLVideoElement>));
    const setDurationAction = store.getActions()[1];
    const sliceState = store.getState()[sliceName];

    expect(setDurationAction).toEqual({
      type: playerActions.setDuration.type,
      payload: mockVideoElement.duration,
    });
    expect(sliceState).toEqual(expect.objectContaining({
      duration: mockVideoElement.duration
    }));
  });

  it(`should dispatch ${playerActions.setCurrentTime.type} action on video time update`, () => {
    const timeUpdates = [10, 20, 30, 40];
    const { withStoreComponent, store } = withStore(withHistoryComponent);

    render(withStoreComponent);
    const [renderVideoArguments] = mockRenderVideo.mock.calls[0];

    timeUpdates.forEach((time) => {
      const mockEvent = { target: { currentTime: time } };
      act(() => renderVideoArguments.onTimeUpdate!(mockEvent as unknown as SyntheticEvent<HTMLVideoElement>));

      expect(store.getActions().at(-1)).toEqual({
        type: playerActions.setCurrentTime.type,
        payload: time,
      });
      expect(store.getState()[sliceName]).toEqual(expect.objectContaining({
        currentTime: time
      }));
    });
  });

  describe('playback reset', () => {
    it('should reset playback on mount', () => {
      const { withStoreComponent, store } = withStore(withHistoryComponent, {
        [sliceName]: {
          duration: 120,
          currentTime: 60,
          userSelectedTime: 30,
        }
      });

      render(withStoreComponent);
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());
      const sliceState = store.getState()[sliceName];

      expect(dispatchedActionsTypes).toEqual([
        playerActions.resetPlayback.type
      ]);
      expect(sliceState).toEqual({
        duration: 120,
        currentTime: 0,
        userSelectedTime: 0,
      });
    });

    it('should not reset playback on rerender', () => {
      const { withStoreComponent, store } = withStore(withHistoryComponent);

      const { rerender } = render(withStoreComponent);
      act(() => {
        store.dispatch(playerActions.setDuration(100));
        store.dispatch(playerActions.setUserSelectedTime(30));
        store.dispatch(playerActions.setCurrentTime(60));
      });
      rerender(withStoreComponent);
      const sliceState = store.getState()[sliceName];

      expect(sliceState).toEqual({
        duration: 100,
        currentTime: 60,
        userSelectedTime: 30,
      });
    });
  });
});
