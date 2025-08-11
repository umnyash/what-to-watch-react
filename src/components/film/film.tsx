import { FilmSections, FILM_TABER_ACTIVE_TAB_SEARCH_PARAM } from './const';
import { PageFilm } from '../../types/films';
import SiteHeader from '../site-header';
import FilmHeader from '../film-header';
import FilmTaber, { Tabs } from '../film-taber';
import FilmOverview from '../film-overview';
import FilmDetails from '../film-details';
import Reviews from '../reviews';

type FilmProps = {
  film: PageFilm;
}

function Film({ film }: FilmProps): JSX.Element {
  const { id, name, posterImage, backgroundImage } = film;

  const tabs: Tabs = [
    {
      title: FilmSections.Overview,
      content: <FilmOverview film={film} />
    },
    {
      title: FilmSections.Details,
      content: <FilmDetails film={film} />
    },
    {
      title: FilmSections.Reviews,
      content: <Reviews filmId={id} />
    }
  ];

  return (
    <section className="film-card film-card--full">
      <div className="film-card__hero">
        <div className="film-card__bg">
          <img src={backgroundImage} alt={name} />
        </div>
        <h1 className="visually-hidden">WTW</h1>
        <SiteHeader className="film-card__head" withUserNavigation />
        <div className="film-card__wrap">
          <FilmHeader film={film} />
        </div>
      </div>

      <div className="film-card__wrap film-card__translate-top">
        <div className="film-card__info">
          <div className="film-card__poster film-card__poster--big">
            <img src={posterImage} alt={`${name} poster`} width="218" height="327" />
          </div>

          <FilmTaber tabs={tabs} tabSearchParam={FILM_TABER_ACTIVE_TAB_SEARCH_PARAM} />
        </div>
      </div>
    </section>
  );
}

export default Film;
