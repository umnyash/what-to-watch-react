import { State } from '../types/state';
import { AuthorizationStatus, RequestStatus, loginResponseErrorDetailMessages, ERROR_PLACEHOLDER_MESSAGE } from '../const';
import { validationErrorMessages } from '../validation';

export const selectors = {
  authorizationStatus: (state: State) => state.authorizationStatus,
  isAuthChecked: (state: State) => state.authorizationStatus !== AuthorizationStatus.Unknown,
  isAuth: (state: State) => state.authorizationStatus === AuthorizationStatus.Auth,
  isNoAuth: (state: State) => state.authorizationStatus === AuthorizationStatus.NoAuth,
  isLoggingIn: (state: State) => state.loggingInStatus === RequestStatus.Pending,

  loginErrorMessage: (state: State) => {
    const data = state.loginErrorData;

    if (!data) {
      return null;
    }

    if (data.details) {
      const allMessages = loginResponseErrorDetailMessages;

      const currentMessages = data.details.reduce((acc: Record<string, boolean>, detail) => {
        detail.messages.forEach((message) => {
          acc[message] = true;
        });

        return acc;
      }, {});

      if (currentMessages[allMessages.email.required] && currentMessages[allMessages.password.required]) {
        return validationErrorMessages.emailAndPassword.required;
      }

      const emailErrorMessage =
        (currentMessages[allMessages.email.required] && validationErrorMessages.email.required) ||
        (currentMessages[allMessages.email.pattern] && validationErrorMessages.email.pattern) ||
        '';

      const passwordErrorMessage =
        (currentMessages[allMessages.password.required] && validationErrorMessages.password.required) ||
        (currentMessages[allMessages.password.pattern] && validationErrorMessages.password.pattern) ||
        (currentMessages[allMessages.password.minLength] && validationErrorMessages.password.minLength) ||
        '';

      return `${emailErrorMessage} ${passwordErrorMessage}`.trim();
    }

    return ERROR_PLACEHOLDER_MESSAGE;
  },

  user: (state: State) => state.user,
  films: (state: State) => state.films,
  isFilmsLoading: (state: State) => state.isFilmsLoading === RequestStatus.Pending,
  film: (state: State) => state.film,
  isFilmLoading: (state: State) => state.isFilmLoading === RequestStatus.Pending,
  promoFilm: (state: State) => state.promoFilm,
  similarFilms: (state: State) => state.similarFilms,
  favorites: (state: State) => state.favorites,
  changingFavoritesStatusFilmsIds: (state: State) => state.changingFavoriteStatusFilmsIds,
  reviews: (state: State) => state.reviews,
  isReviewSubmitting: (state: State) => state.reviewSubmittingStatus === RequestStatus.Pending,
  genre: (state: State) => state.genre
} as const;
