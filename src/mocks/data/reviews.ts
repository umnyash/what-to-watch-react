import { faker } from '@faker-js/faker';
import { Review, Reviews } from '../../types/reviews';

export const getMockReview = (preset: Partial<Review> = {}): Review => ({
  id: crypto.randomUUID(),
  date: faker.date.past().toISOString(),
  user: faker.person.fullName(),
  rating: faker.number.int({ min: 1, max: 10 }),
  comment: faker.lorem.paragraph(),
  ...preset
});

export const getMockReviews = (count: number, preset: Partial<Review> = {}): Reviews =>
  Array.from({ length: count }, () => getMockReview(preset));
