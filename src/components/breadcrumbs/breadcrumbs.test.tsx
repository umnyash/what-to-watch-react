import { screen, render } from '@testing-library/react';
import { withHistory } from '../../tests/render-helpers';
import Breadcrumbs from './breadcrumbs';

import { getMockBreadcrumbs } from '../../mocks/data';

describe('Component: Breadcrumbs', () => {
  const noHrefBreadcrumbsCount = 1;

  it.each([
    [getMockBreadcrumbs(2)],
    [getMockBreadcrumbs(3)],
  ])('should render correctly', (breadcrumbs) => {
    const expectedLinkItemsCount = breadcrumbs.length - noHrefBreadcrumbsCount;
    const lastBreadcrumbText = breadcrumbs[breadcrumbs.length - 1].text;
    const { withHistoryComponent } = withHistory(<Breadcrumbs items={breadcrumbs} />);

    render(withHistoryComponent);
    const linkElements = screen.getAllByRole('link');
    const notExpectedLinkElement = screen.queryByRole('link', { name: lastBreadcrumbText });
    const lastBreadcrumbElement = screen.getByText(lastBreadcrumbText);

    expect(linkElements).toHaveLength(expectedLinkItemsCount);
    linkElements.forEach((linkElement, index) => {
      const breadcrumb = breadcrumbs[index];

      expect(linkElement).toHaveTextContent(breadcrumb.text);
      expect(linkElement).toHaveAttribute('href', breadcrumb.href);
    });
    expect(notExpectedLinkElement).not.toBeInTheDocument();
    expect(lastBreadcrumbElement).toBeInTheDocument();
  });
});
