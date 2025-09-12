import { useLocation, Location, generatePath } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { AppRoute, PageTitle } from '../../const';
import { LocationState } from '../../types/location';
import { PromoFilm } from '../../types/films';
import Player from '../player';
import withVideo from '../../hocs/with-video/with-video';

type PlayerPageContentProps = {
  film: PromoFilm;
}

const PlayerWrapped = withVideo(Player);

function PlayerPageContent({ film }: PlayerPageContentProps): JSX.Element {
  const location = useLocation() as Location<LocationState>;
  const filmPageLink = generatePath(AppRoute.Film, { id: film.id });

  return (
    <>
      <Helmet>
        <title>{PageTitle.Player}</title>
      </Helmet>
      <PlayerWrapped film={film} previousPage={location.state?.from || filmPageLink} />
    </>
  );
}

export default PlayerPageContent;
