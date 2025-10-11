import { Routes, Route, generatePath, useParams, useSearchParams } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoute, APIRoute, RequestStatus, CommentLength, SliceName } from '../../const';
import { FILM_TABER_ACTIVE_TAB_SEARCH_PARAM, FilmSections } from '../film/const';
import { getMockReview } from '../../mocks/data';
import { extractActionsTypes } from '../../tests/util';
import { withHistory, withStore } from '../../tests/render-helpers';
import { submitReview } from '../../store/async-actions';

import ReviewForm from './review-form';

describe('Component: ReviewForm (integration)', () => {
  const mockFilmId = 'abc';
  const commentFieldPlaceholder = 'Review text';
  const submitButtonText = 'Post';
  const someValidComment = '*'.repeat(CommentLength.Min);
  const someRatingLabel = /Rating 5/i;
  const reviewPagePath = generatePath(AppRoute.Review, { id: mockFilmId });

  const MockFilmPageComponent = () => {
    const filmId = useParams().id as string;
    const [searchParams] = useSearchParams();

    return (
      <>
        <p>filmId: {filmId}</p>
        <p>searchParams: {`${FILM_TABER_ACTIVE_TAB_SEARCH_PARAM}=${searchParams.get(FILM_TABER_ACTIVE_TAB_SEARCH_PARAM)}`}</p>
      </>
    );
  };

  const { withHistoryComponent, history } = withHistory(
    <Routes>
      <Route path={AppRoute.Review} element={<ReviewForm filmId={mockFilmId} />} />
      <Route path={AppRoute.Film} element={<MockFilmPageComponent />} />
    </Routes>,
    reviewPagePath
  );

  beforeEach(() => history.push(reviewPagePath));

  const fillOutAndSubmitForm = async () => {
    const user = userEvent.setup();
    const radioButtonElement = screen.getByLabelText(someRatingLabel);
    const commentFieldElement = screen.getByPlaceholderText(commentFieldPlaceholder);
    const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
    await user.click(radioButtonElement);
    await user.click(commentFieldElement);
    await user.paste(someValidComment);
    await user.click(submitButtonElement);

    return { radioButtonElement, commentFieldElement };
  };

  it('should successfully submit review and navigate to film page with reviews tab active', async () => {
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent);
    const mockReview = getMockReview();
    mockAPIAdapter
      .onPost(generatePath(APIRoute.Reviews, { id: mockFilmId }))
      .reply(StatusCodes.CREATED, mockReview);

    render(withStoreComponent);
    await fillOutAndSubmitForm();
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());

    expect(dispatchedActionsTypes).toEqual([
      submitReview.pending.type,
      submitReview.fulfilled.type,
    ]);
    expect(store.getState()[SliceName.Review]).toEqual({
      submittingStatus: RequestStatus.Success
    });
    expect(screen.getByText(`filmId: ${mockFilmId}`));
    expect(screen.getByText(`searchParams: ${FILM_TABER_ACTIVE_TAB_SEARCH_PARAM}=${FilmSections.Reviews}`));
  });

  it('should preserve user input and stay on review page when form submission fails', async () => {
    const { withStoreComponent, store, mockAPIAdapter } = withStore(withHistoryComponent);
    mockAPIAdapter
      .onPost(generatePath(APIRoute.Reviews, { id: mockFilmId }))
      .networkError();

    render(withStoreComponent);
    const { radioButtonElement, commentFieldElement } = await fillOutAndSubmitForm();
    const dispatchedActionsTypes = extractActionsTypes(store.getActions());

    expect(dispatchedActionsTypes).toEqual([
      submitReview.pending.type,
      submitReview.rejected.type,
    ]);
    expect(store.getState()[SliceName.Review]).toEqual({
      submittingStatus: RequestStatus.Error
    });
    expect(radioButtonElement).toBeChecked();
    expect(commentFieldElement).toHaveTextContent(someValidComment);
  });
});
