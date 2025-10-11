import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SliceName } from '../../const';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { getMockFilms } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';
import GenresList from '../genres-list';
import FilmsList from '../films-list';

import CatalogContent from './catalog-content';

vi.mock('../genres-list', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../films-list', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/catalog/catalog.selectors', () => ({
  catalogSelectors: {
    displayedFilms: vi.fn(),
    hasMoreFilms: vi.fn(),
  }
}));

describe('Component: CatalogContent', () => {
  const showMoreButtonText = 'Show more';

  it('should render correctly', () => {
    const mockFilms = getMockFilms(1);
    const { withStoreComponent } = withStore(<CatalogContent />);
    vi.mocked(catalogSelectors).displayedFilms.mockReturnValue(mockFilms);

    render(withStoreComponent);

    expect(GenresList).toHaveBeenCalledOnce();
    expect(FilmsList).toHaveBeenCalledOnce();
    expect(FilmsList).toHaveBeenCalledWith({ films: mockFilms }, expect.anything());
  });

  describe('Show more button', () => {
    it('should not render "Show more" button when hasMoreFilms selector returns false', () => {
      const { withStoreComponent } = withStore(<CatalogContent />);
      vi.mocked(catalogSelectors).hasMoreFilms.mockReturnValue(false);

      render(withStoreComponent);
      const button = screen.queryByRole('button', { name: showMoreButtonText });

      expect(button).not.toBeInTheDocument();
    });

    it('should render "Show more" button when hasMoreFilms selector returns true', () => {
      const { withStoreComponent } = withStore(<CatalogContent />);
      vi.mocked(catalogSelectors).hasMoreFilms.mockReturnValue(true);

      render(withStoreComponent);
      const button = screen.getByRole('button', { name: showMoreButtonText });

      expect(button).toBeInTheDocument();
    });

    it('should increase displayedFilmsMaxCount when clicking button', async () => {
      const { withStoreComponent, store } = withStore(<CatalogContent />);
      vi.mocked(catalogSelectors).hasMoreFilms.mockReturnValue(true);
      const displayedFilmsMaxCount = store.getState()[SliceName.Catalog].displayedFilmsMaxCount;
      const user = userEvent.setup();

      render(withStoreComponent);
      const button = screen.getByRole('button', { name: showMoreButtonText });
      await user.click(button);
      const updatedDisplayedFilmsMaxCount = store.getState()[SliceName.Catalog].displayedFilmsMaxCount;

      expect(updatedDisplayedFilmsMaxCount).toBeGreaterThan(displayedFilmsMaxCount);
    });
  });
});
