import { screen, render, fireEvent } from '@testing-library/react';

import { SliceName } from '../../const';
import { TestStore } from '../../store';
import { withStore } from '../../tests/render-helpers';
import { extractActionsTypes } from '../../tests/util';
import { playerActions } from '../../store/player/player.slice';

import ProgressBar from './progress-bar';

const SMALL_TIME_SHIFT = 0.001;
const sliceName = SliceName.Player;

const createMockRect = (left: number = 0, width: number = 100) => ({
  x: left,
  y: 0,
  width,
  height: 1,
  top: 0,
  bottom: 1,
  left,
  right: left + width,
  toJSON: () => { },
});

const getUserSelectedTime = (store: TestStore) => store
  .getState()[sliceName]
  .userSelectedTime;

describe('Component: ProgressBar (integration)', () => {
  it.each([
    [1, 100, 0, 100, 1],
    [50, 100, 0, 100, 50],
    [100, 100, 0, 100, 100],

    [30, 100, 20, 100, 50],
    [50, 100, 20, 100, 70],
    [80, 100, 20, 100, 100],

    [100, 200, 0, 100, 50],
    [150, 300, 0, 100, 50],
    [20, 100, 0, 50, 10],
    [50, 100, 0, 50, 25],
  ])(
    'should set playback time to %s when user click on progress (duration: %s, left: %s, width: %s, clientX: %s)',
    (expectedTime, duration, left, width, clickEventClientX) => {
      const { withStoreComponent, store } = withStore(<ProgressBar />, {
        [sliceName]: {
          duration,
          currentTime: 0,
          userSelectedTime: 0,
        }
      });
      const mockRect = createMockRect(left, width);

      render(withStoreComponent);
      const progressElement: HTMLProgressElement = screen.getByRole('progressbar');
      progressElement.getBoundingClientRect = vi.fn(() => mockRect);
      fireEvent.click(progressElement, { clientX: clickEventClientX });
      const dispatchedActionsTypes = extractActionsTypes(store.getActions());

      expect(dispatchedActionsTypes).toEqual([playerActions.setUserSelectedTime.type]);
      expect(getUserSelectedTime(store)).toBe(expectedTime);
    }
  );

  it('should add small time shift when clicking on same position twice', () => {
    const { withStoreComponent, store } = withStore(<ProgressBar />, {
      [sliceName]: {
        duration: 100,
        currentTime: 0,
        userSelectedTime: 0,
      }
    });
    const mockRect = createMockRect();
    const clickEventClientX = 50;
    const expectedUserSelectedTime = 50;

    render(withStoreComponent);
    const progressElement: HTMLProgressElement = screen.getByRole('progressbar');
    progressElement.getBoundingClientRect = vi.fn(() => mockRect);
    fireEvent.click(progressElement, { clientX: clickEventClientX });

    expect(getUserSelectedTime(store)).toBe(expectedUserSelectedTime);

    fireEvent.click(progressElement, { clientX: clickEventClientX });
    expect(getUserSelectedTime(store)).toBe(expectedUserSelectedTime + SMALL_TIME_SHIFT);

    fireEvent.click(progressElement, { clientX: clickEventClientX });
    expect(getUserSelectedTime(store)).toBe(expectedUserSelectedTime);

    fireEvent.click(progressElement, { clientX: clickEventClientX });
    expect(getUserSelectedTime(store)).toBe(expectedUserSelectedTime + SMALL_TIME_SHIFT);

    fireEvent.click(progressElement, { clientX: clickEventClientX });
    expect(getUserSelectedTime(store)).toBe(expectedUserSelectedTime);

    expect(store.getActions()).toHaveLength(5);
  });
});
