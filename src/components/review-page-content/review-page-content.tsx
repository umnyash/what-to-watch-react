import { generatePath } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { AppRoute, PageTitle } from '../../const';
import { PromoFilm } from '../../types/films';
import SiteHeader from '../../components/site-header';
import ReviewForm from '../../components/review-form';

type ReviewPageContentProps = {
  film: PromoFilm;
}

function ReviewPageContent({ film }: ReviewPageContentProps): JSX.Element {
  const { id, name, posterImage, backgroundImage } = film;
  const filmPageRoute = generatePath(AppRoute.Film, { id });

  const breadcrumbs = [
    { text: name, href: filmPageRoute },
    { text: 'Add review' }
  ];

  return (
    <section className="film-card film-card--full">
      <Helmet>
        <title>{PageTitle.Review}</title>
      </Helmet>
      <div className="film-card__header">
        <div className="film-card__bg">
          <img src={backgroundImage} alt={name} />
        </div>
        <h1 className="visually-hidden">WTW</h1>
        <SiteHeader breadcrumbs={breadcrumbs} withUserNavigation />
        <div className="film-card__poster film-card__poster--small">
          <img src={posterImage} alt={`${name} poster`} width="218" height="327" />
        </div>
      </div>

      <div className="add-review">
        <ReviewForm filmId={id} />
      </div>
    </section>
  );
}

export default ReviewPageContent;
