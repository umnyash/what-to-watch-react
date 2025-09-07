export enum MockGenre {
  // Action = 'action',
  // Drama = 'drama',
  // Crime = 'crime',
  Adventure = 'adventure',
  Comedy = 'comedy',
  // Fantasy = 'fantasy',
  // Romance = 'romance',
  Animation = 'animation',
  // Musical = 'musical',
  // SciFi = 'sci-fi',
}

export const getMockUniqueGenres = (count: number) =>
  Array.from({ length: count }, (_, index) => `genre-${index}`);
