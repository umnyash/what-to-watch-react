import { generatePath } from 'react-router-dom';
import { createAppAsyncThunk } from '../../hooks';
import { APIRoute, SliceName } from '../../const';
import { Review, ReviewContent } from '../../types/reviews';

export const submitReview = createAppAsyncThunk<
  Review,
  {
    filmId: string;
    content: ReviewContent;
  }
>(
  `${SliceName.Reviews}/submit`,
  async ({ filmId, content }, { extra: { api } }) => {
    const apiRoute = generatePath(APIRoute.Reviews, { id: filmId });
    const { data } = await api.post<Review>(apiRoute, content);
    return data;
  },
);
