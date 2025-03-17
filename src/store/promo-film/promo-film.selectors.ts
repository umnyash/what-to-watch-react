import { State } from '../../types/state';
import { SliceName } from '../../const';

const sliceName = SliceName.PromoFilm;

const film = (state: State) => state[sliceName].film;

export const promoFilmSelectors = {
  film,
};
