import { screen, render } from '@testing-library/react';

import { withStore } from '../../tests/render-helpers';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import ErrorMessage from '../error-message';
import Spinner from '../spinner';
import CatalogContent from '../catalog-content';

import Catalog from './catalog';

vi.mock('../spinner', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../error-message', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../catalog-content', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/catalog/catalog.selectors', () => ({
  catalogSelectors: {
    isFilmsLoading: vi.fn(),
    isFilmsLoaded: vi.fn(),
    isFilmsLoadFailed: vi.fn(),
  }
}));

describe('Component: Catalog', () => {
  const { withStoreComponent } = withStore(<Catalog />);
  const mockedCatalogSelectors = vi.mocked(catalogSelectors);

  beforeEach(() => {
    mockedCatalogSelectors.isFilmsLoading.mockReturnValue(false);
    mockedCatalogSelectors.isFilmsLoaded.mockReturnValue(false);
    mockedCatalogSelectors.isFilmsLoadFailed.mockReturnValue(false);

    vi.clearAllMocks();
  });

  it('should render only catalog heading when all selectors returns false', () => {
    const catalogHeadingText = 'Catalog';

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading');

    expect(headingElement).toHaveTextContent(catalogHeadingText);
    expect(Spinner).not.toHaveBeenCalled();
    expect(CatalogContent).not.toHaveBeenCalled();
    expect(ErrorMessage).not.toHaveBeenCalled();
  });

  it('should render Spinner when isFilmsLoading returns true', () => {
    mockedCatalogSelectors.isFilmsLoading.mockReturnValue(true);

    render(withStoreComponent);

    expect(Spinner).toHaveBeenCalledOnce();
    expect(CatalogContent).not.toHaveBeenCalled();
    expect(ErrorMessage).not.toHaveBeenCalled();
  });

  it('should render CatalogContent when isFilmsLoaded returns true', () => {
    mockedCatalogSelectors.isFilmsLoaded.mockReturnValue(true);

    render(withStoreComponent);

    expect(CatalogContent).toHaveBeenCalledOnce();
    expect(Spinner).not.toHaveBeenCalled();
    expect(ErrorMessage).not.toHaveBeenCalled();
  });

  it('should render ErrorMessage when isFilmsLoadFailed returns true', () => {
    mockedCatalogSelectors.isFilmsLoadFailed.mockReturnValue(true);

    render(withStoreComponent);

    expect(ErrorMessage).toHaveBeenCalledOnce();
    expect(ErrorMessage).toHaveBeenCalledWith(
      {
        text: 'We couldn\'t load the films. Please try again later.',
        onRetryButtonClick: expect.any(Function) as unknown as () => void,
      },
      expect.anything()
    );
    expect(Spinner).not.toHaveBeenCalled();
    expect(CatalogContent).not.toHaveBeenCalled();
  });
});
