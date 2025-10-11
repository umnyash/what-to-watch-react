import { screen, render } from '@testing-library/react';

import { MockGenre } from '../../mocks/data';
import { withStore } from '../../tests/render-helpers';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';

import GenresList from './genres-list';

vi.mock('../../store/catalog/catalog.selectors', () => ({
  catalogSelectors: {
    topGenres: vi.fn(),
    genreFilter: vi.fn(),
  }
}));

describe('Component: GenresList', () => {
  const genres = [MockGenre.Adventure, MockGenre.Comedy];
  const mockedSelectors = vi.mocked(catalogSelectors);

  const genreResetButton = {
    count: 1,
    text: 'All genres',
    value: null,
  };

  it('should render correctly', () => {
    const { withStoreComponent } = withStore(<GenresList />);
    mockedSelectors.topGenres.mockReturnValue(genres);

    render(withStoreComponent);
    const listElement = screen.getByRole('list');

    expect(listElement).toBeInTheDocument();
    genres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  it('should render genre reset button as first item', () => {
    const { withStoreComponent } = withStore(<GenresList />);
    mockedSelectors.topGenres.mockReturnValue(genres);

    render(withStoreComponent);
    const itemElements = screen.getAllByRole('listitem');

    expect(itemElements).toHaveLength(genreResetButton.count + genres.length);
    expect(itemElements[0]).toHaveTextContent(genreResetButton.text);
  });

  it.each([
    {
      genreFilter: null,
      activeItemText: genreResetButton.text,
      inactiveItemTexts: [MockGenre.Adventure, MockGenre.Comedy],
    },
    {
      genreFilter: MockGenre.Adventure,
      activeItemText: MockGenre.Adventure,
      inactiveItemTexts: [genreResetButton.text, MockGenre.Comedy],
    },
    {
      genreFilter: MockGenre.Comedy,
      activeItemText: MockGenre.Comedy,
      inactiveItemTexts: [genreResetButton.text, MockGenre.Adventure],
    },
  ])('should render as links only inactive buttons', ({ genreFilter, activeItemText, inactiveItemTexts }) => {
    const { withStoreComponent } = withStore(<GenresList />);
    mockedSelectors.topGenres.mockReturnValue(genres);
    mockedSelectors.genreFilter.mockReturnValue(genreFilter);

    render(withStoreComponent);

    expect(screen.queryByRole('link', { name: activeItemText })).not.toBeInTheDocument();
    inactiveItemTexts.forEach((text) => {
      expect(screen.getByRole('link', { name: text })).toBeInTheDocument();
    });
  });
});
