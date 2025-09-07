import { faker } from '@faker-js/faker';

import { BreadcrumbItems } from '../../components/breadcrumbs';

export const getMockBreadcrumbs = (length: number): BreadcrumbItems =>
  Array.from({ length }, (_, index) => ({
    text: faker.lorem.word(),
    href: (index + 1) < length ? faker.internet.url() : undefined
  }));
