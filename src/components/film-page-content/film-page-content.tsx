import { Helmet } from 'react-helmet-async';
import { PageTitle } from '../../const';
import { PageFilm } from '../../types/films';
import Film from '../film';
import SimilarFilms from '../similar-films';
import SiteFooter from '../site-footer';

type FilmPageContentProps = {
  film: PageFilm;
}

function FilmPageContent({ film }: FilmPageContentProps): JSX.Element {
  return (
    <>
      <Helmet>
        <title>{PageTitle.Film}</title>
      </Helmet>

      <Film film={film} />

      <div className="page-content">
        <SimilarFilms filmId={film.id} />
        <SiteFooter />
      </div>
    </>
  );
}

export default FilmPageContent;
