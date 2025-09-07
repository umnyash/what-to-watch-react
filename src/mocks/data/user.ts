import { faker } from '@faker-js/faker';
import { User, AuthUser } from '../../types/user';

export const getMockUser = (): User => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatarUrl: faker.system.filePath(),
});

export const getMockAuthUser = (): AuthUser => ({
  token: 'secret',
  ...getMockUser()
});
