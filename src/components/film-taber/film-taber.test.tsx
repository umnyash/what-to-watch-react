import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory } from '../../tests/render-helpers';

import FilmTaber from './film-taber';

describe('Component: FilmTaber', () => {
  const mockTabSearcParam = 'secondTaberTab';
  const mockTabs = [
    {
      title: 'Title1',
      content: <span>Content 1</span>,
    },
    {
      title: 'Title2',
      content: <span>Content 2</span>,
    },
    {
      title: 'Title3',
      content: <span>Content 3</span>,
    },
  ];

  it('should render tab list correctly', () => {
    const activeTabCount = 1;
    const { withHistoryComponent } = withHistory(
      <FilmTaber tabs={mockTabs} tabSearchParam={mockTabSearcParam} />
    );

    render(withHistoryComponent);
    const tabsListElement = screen.getByRole('list');
    const tabsItemElements = screen.getAllByRole('listitem');
    const notActiveTabElements = screen.getAllByRole('link');

    expect(tabsListElement).toBeInTheDocument();
    expect(tabsItemElements).toHaveLength(mockTabs.length);
    expect(notActiveTabElements).toHaveLength(mockTabs.length - activeTabCount);
    notActiveTabElements.forEach((tabElement) => {
      expect(tabElement.parentElement).toHaveAttribute('class', 'film-nav__item');
    });
  });

  it('should make first tab active by default', () => {
    const { withHistoryComponent } = withHistory(
      <FilmTaber tabs={mockTabs} tabSearchParam={mockTabSearcParam} />
    );

    render(withHistoryComponent);
    const activeTabElement = screen.getByText(mockTabs[0].title);
    const activeTabItemElement = activeTabElement.parentElement;

    expect(activeTabElement).toBeInTheDocument();
    expect(activeTabElement).not.toBeInstanceOf(HTMLAnchorElement);
    expect(activeTabItemElement).toHaveAttribute('class', 'film-nav__item film-nav__item--active');
  });

  it.each([
    mockTabs[1],
    mockTabs[2]
  ])(
    'should activate tab and set search param on clicked inactive tab',
    async (tab) => {
      const { withHistoryComponent, history } = withHistory(
        <FilmTaber tabs={mockTabs} tabSearchParam={mockTabSearcParam} />,
        { search: '?otherParam=test' }
      );
      const user = userEvent.setup();

      render(withHistoryComponent);
      const tabElement = screen.getByRole('link', { name: tab.title });
      await user.click(tabElement);
      const searchParams = new URLSearchParams(history.location.search);

      expect(screen.queryByRole('link', { name: tab.title })).not.toBeInTheDocument();
      expect(searchParams.get(mockTabSearcParam)).toBe(tab.title);
      expect(searchParams.get('otherParam')).toBe('test');
    }
  );

  describe('search param', () => {
    it.each(mockTabs)(
      `should activate corresponding tab based on "${mockTabSearcParam}" search param on mount`,
      (tab) => {
        const { withHistoryComponent } = withHistory(
          <FilmTaber tabs={mockTabs} tabSearchParam={mockTabSearcParam} />,
          { search: `?${mockTabSearcParam}=${tab.title}` }
        );

        render(withHistoryComponent);
        const activeTabElement = screen.getByText(tab.title);
        const activeTabItemElement = activeTabElement.parentElement;

        expect(activeTabElement).toBeInTheDocument();
        expect(activeTabElement).not.toBeInstanceOf(HTMLAnchorElement);
        expect(activeTabItemElement).toHaveAttribute('class', 'film-nav__item film-nav__item--active');
      }
    );
  });
});
