import { ChangeEvent } from 'react';
import { screen, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CommentLength } from '../../const';
import { withHistory, withStore } from '../../tests/render-helpers';
import { reviewSelectors } from '../../store/review/review.selectors';
import StarsRating from '../stars-rating';

import ReviewForm from './review-form';

vi.mock('../stars-rating', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../../store/review/review.selectors', () => ({
  reviewSelectors: {
    isSubmitting: vi.fn(() => false)
  }
}));

const createMockRatingChangeEvent = (value: number) => ({ target: { name: 'rating', value } });

describe('Component: ReviewForm', () => {
  const mockFilmId = 'abc';
  const commentFieldPlaceholder = 'Review text';
  const submitButtonText = 'Post';

  const { withHistoryComponent } = withHistory(<ReviewForm filmId={mockFilmId} />);
  const { withStoreComponent } = withStore(withHistoryComponent);

  beforeEach(() => vi.clearAllMocks());

  it('should render form with initial state: StarsRating value 0, empty comment field and disabled submit button', () => {
    render(withStoreComponent);
    const commentFieldElement = screen.getByPlaceholderText(commentFieldPlaceholder);
    const submitButtonElement = screen.getByRole('button', { name: submitButtonText });

    expect(StarsRating).toHaveBeenCalledOnce();
    expect(StarsRating).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 0
      }),
      expect.anything()
    );
    expect(commentFieldElement).toHaveTextContent('');
    expect(submitButtonElement).toBeDisabled();
  });

  it('should update StarsRating component with new value when rating changes', () => {
    const ratings = [1, 4, 7, 10];

    render(withStoreComponent);
    const [props] = vi.mocked(StarsRating).mock.calls[0];

    ratings.forEach((value) => {
      const mockEvent = createMockRatingChangeEvent(value);
      act(() => props.onChange(mockEvent as unknown as ChangeEvent<HTMLInputElement>));

      expect(StarsRating).toHaveBeenLastCalledWith(
        expect.objectContaining({
          value
        }),
        expect.anything()
      );
    });
  });

  it('should update comment field value when user types', async () => {
    const expectedText = 'Lorem';
    const user = userEvent.setup();

    render(withStoreComponent);
    const commentFieldElement = screen.getByPlaceholderText(commentFieldPlaceholder);
    await user.type(commentFieldElement, 'Lorem');

    expect(screen.getByDisplayValue(expectedText)).toBeInTheDocument();
  });

  describe('validation', () => {
    const someValidShortComment = '*'.repeat(CommentLength.Min);
    const someValidLongComment = '*'.repeat(CommentLength.Max);
    const someInvalidShortComment = '*'.repeat(CommentLength.Min - 1);
    const someInvalidLongComment = '*'.repeat(CommentLength.Max + 1);
    const someValidRating = 7;
    const invalidRating = 0;

    it(`should enforce maximum comment length of ${CommentLength.Max} characters when user inputs text`, async () => {
      const user = userEvent.setup();

      render(withStoreComponent);
      const commentFieldElement: HTMLTextAreaElement = screen.getByPlaceholderText(commentFieldPlaceholder);

      expect(commentFieldElement).toHaveAttribute('maxlength', String(CommentLength.Max));

      await user.click(commentFieldElement);
      await user.paste(someValidLongComment);
      await user.type(commentFieldElement, '*');
      expect(commentFieldElement.value).toHaveLength(CommentLength.Max);

      await user.paste(someInvalidLongComment);
      expect(commentFieldElement.value).toHaveLength(CommentLength.Max);
    });

    it.each([
      someValidShortComment,
      someValidLongComment,
    ])(
      'should enable submit button with valid comment and rating when not submitting',
      async (comment) => {
        const mockRatingChangeEvent = createMockRatingChangeEvent(someValidRating);
        const user = userEvent.setup();

        render(withStoreComponent);
        const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
        const commentFieldElement = screen.getByPlaceholderText(commentFieldPlaceholder);
        const [starsRatingProps] = vi.mocked(StarsRating).mock.calls[0];
        act(() => starsRatingProps.onChange(mockRatingChangeEvent as unknown as ChangeEvent<HTMLInputElement>));
        await user.click(commentFieldElement);
        await user.paste(comment);

        expect(submitButtonElement).toBeEnabled();
      }
    );

    it.each([
      {
        condition: 'rating not selected (default 0)',
        comment: someValidShortComment,
        rating: invalidRating,
      },
      {
        condition: `comment is shorter than ${CommentLength.Min} characters`,
        comment: someInvalidShortComment,
        rating: someValidRating,
      },
    ])(
      'should disable submit button when isSubmitting selector returns false and $condition',
      async ({ comment, rating }) => {
        const mockRatingChangeEvent = createMockRatingChangeEvent(rating);
        const user = userEvent.setup();

        render(withStoreComponent);
        const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
        const commentFieldElement = screen.getByPlaceholderText(commentFieldPlaceholder);
        const [starsRatingProps] = vi.mocked(StarsRating).mock.calls[0];
        act(() => starsRatingProps.onChange(mockRatingChangeEvent as unknown as ChangeEvent<HTMLInputElement>));
        await user.click(commentFieldElement);
        await user.paste(comment);

        expect(submitButtonElement).toBeDisabled();
      }
    );
  });

  it('should disable all form fields and submit button when isSubmitting selector returns true', () => {
    vi.mocked(reviewSelectors).isSubmitting.mockReturnValue(true);

    render(withStoreComponent);
    const commentFieldElement = screen.getByPlaceholderText(commentFieldPlaceholder);
    const submitButtonElement = screen.getByRole('button', { name: submitButtonText });

    expect(StarsRating).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true
      }),
      expect.anything()
    );
    expect(commentFieldElement).toBeDisabled();
    expect(submitButtonElement).toBeDisabled();
  });
});
