import { render, act } from '@testing-library/react';

import { AppRoute } from '../../const';
import { withHistory } from '../../tests/render-helpers';

import ScrollToTop from './scroll-to-top';

describe('Component: ScrollToTop', () => {
  const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => { });

  beforeEach(() => vi.clearAllMocks());

  it('scrolls to top on initial render', () => {
    const { withHistoryComponent } = withHistory(<ScrollToTop />);
    render(withHistoryComponent);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('does not scroll if path hasn\'t changed', () => {
    const { withHistoryComponent, history } = withHistory(<ScrollToTop />, AppRoute.Root);

    render(withHistoryComponent);
    act(() => history.push(AppRoute.Root));

    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });

  it('scrolls on every path change', () => {
    const { withHistoryComponent, history } = withHistory(<ScrollToTop />, AppRoute.Root);

    render(withHistoryComponent);
    expect(scrollToMock).toHaveBeenCalledTimes(1);

    act(() => history.push(AppRoute.Film));
    expect(scrollToMock).toHaveBeenCalledTimes(2);

    act(() => history.push(AppRoute.Root));
    expect(scrollToMock).toHaveBeenCalledTimes(3);
  });
});
