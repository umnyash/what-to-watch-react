import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Films } from '../../types/films';
import { Reviews } from '../../types/reviews';
import { Tabs } from '../../types/tabs';
import { AppRoute, SIMILAR_FILMS_MAX_COUNT } from '../../const';
import Logo from '../../components/logo';
import FilmTaber from '../../components/film-taber';
import ReviewsList from '../../components/reviews-list';
import FilmsList from '../../components/films-list';

type FilmPageProps = {
  similarFilms: Films;
  reviews: Reviews;
}

function FilmPage({ similarFilms, reviews }: FilmPageProps): JSX.Element {
  const tabs: Tabs = [
    {
      title: 'Overview',
      content: (
        <>
          <div className="film-rating">
            <div className="film-rating__score">8,9</div>
            <p className="film-rating__meta">
              <span className="film-rating__level">Very good</span>
              <span className="film-rating__count">240 ratings</span>
            </p>
          </div>

          <div className="film-card__text">
            <p>In the 1930s, the Grand Budapest Hotel is a popular European ski resort, presided over by concierge Gustave H. (Ralph Fiennes). Zero, a junior lobby boy, becomes Gustave&apos;s friend and protege.</p>

            <p>Gustave prides himself on providing first-class service to the hotel&apos;s guests, including satisfying the sexual needs of the many elderly women who stay there. When one of Gustave&apos;s lovers dies mysteriously, Gustave finds himself the recipient of a priceless painting and the chief suspect in her murder.</p>

            <p className="film-card__director"><strong>Director: Wes Anderson</strong></p>

            <p className="film-card__starring"><strong>Starring: Bill Murray, Edward Norton, Jude Law, Willem Dafoe and other</strong></p>
          </div>
        </>
      )
    },
    {
      title: 'Details',
      content: (
        <div className="film-card__text film-card__row">
          <div className="film-card__text-col">
            <p className="film-card__details-item">
              <strong className="film-card__details-name">Director</strong>
              <span className="film-card__details-value">Wes Anderson</span>
            </p>
            <p className="film-card__details-item">
              <strong className="film-card__details-name">Starring</strong>
              <span className="film-card__details-value">
                Bill Murray, <br />
                Edward Norton, <br />
                Jude Law, <br />
                Willem Dafoe, <br />
                Saoirse Ronan, <br />
                Tony Revoloru, <br />
                Tilda Swinton, <br />
                Tom Wilkinson, <br />
                Owen Wilkinson, <br />
                Adrien Brody, <br />
                Ralph Fiennes, <br />
                Jeff Goldblum
              </span>
            </p>
          </div>
          <div className="film-card__text-col">
            <p className="film-card__details-item">
              <strong className="film-card__details-name">Run Time</strong>
              <span className="film-card__details-value">1h 39m</span>
            </p>
            <p className="film-card__details-item">
              <strong className="film-card__details-name">Genre</strong>
              <span className="film-card__details-value">Comedy</span>
            </p>
            <p className="film-card__details-item">
              <strong className="film-card__details-name">Released</strong>
              <span className="film-card__details-value">2014</span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Reviews',
      content: (
        <ReviewsList reviews={reviews} />
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>WTW: Film</title>
      </Helmet>
      <section className="film-card film-card--full">
        <div className="film-card__hero">
          <div className="film-card__bg">
            <img src="img/bg-the-grand-budapest-hotel.jpg" alt="The Grand Budapest Hotel" />
          </div>

          <h1 className="visually-hidden">WTW</h1>

          <header className="page-header film-card__head">
            <Logo />

            <ul className="user-block">
              <li className="user-block__item">
                <div className="user-block__avatar">
                  <img src="img/avatar.jpg" alt="User avatar" width="63" height="63" />
                </div>
              </li>
              <li className="user-block__item">
                <a className="user-block__link">Sign out</a>
              </li>
            </ul>
          </header>

          <div className="film-card__wrap">
            <div className="film-card__desc">
              <h2 className="film-card__title">The Grand Budapest Hotel</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">Drama</span>
                <span className="film-card__year">2014</span>
              </p>

              <div className="film-card__buttons">
                <button className="btn btn--play film-card__button" type="button">
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s" />
                  </svg>
                  <span>Play</span>
                </button>
                <button className="btn btn--list film-card__button" type="button">
                  <svg viewBox="0 0 19 20" width="19" height="20">
                    <use xlinkHref="#add" />
                  </svg>
                  <span>My list</span>
                  <span className="film-card__count">9</span>
                </button>
                <Link to={AppRoute.Review} className="btn film-card__button">Add review</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="film-card__wrap film-card__translate-top">
          <div className="film-card__info">
            <div className="film-card__poster film-card__poster--big">
              <img src="img/the-grand-budapest-hotel-poster.jpg" alt="The Grand Budapest Hotel poster" width="218" height="327" />
            </div>

            <FilmTaber tabs={tabs} />
          </div>
        </div>
      </section>

      <div className="page-content">
        <section className="catalog catalog--like-this">
          <h2 className="catalog__title">More like this</h2>
          <FilmsList films={similarFilms.slice(0, SIMILAR_FILMS_MAX_COUNT)} />
        </section>

        <footer className="page-footer">
          <Logo isLight />

          <div className="copyright">
            <p>© 2019 What to watch Ltd.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default FilmPage;
