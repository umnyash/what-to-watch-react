import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { catalogSelectors } from '../../store/catalog/catalog.selectors';
import { catalogActions } from '../../store/catalog/catalog.slice';
import GenresList from '../genres-list';
import FilmsList from '../films-list';
import Button from '../button';

function CatalogContent(): JSX.Element {
  const displayedFilms = useAppSelector(catalogSelectors.displayedFilms);
  const hasMoreFilms = useAppSelector(catalogSelectors.hasMoreFilms);

  const dispatch = useAppDispatch();

  const handleShowMoreButtonClick = () => {
    dispatch(catalogActions.increaseDisplayedFilmsMaxCount());
  };

  return (
    <>
      <GenresList />
      <FilmsList films={displayedFilms} />

      {hasMoreFilms && (
        <div className="catalog__more">
          <Button onClick={handleShowMoreButtonClick}>Show more</Button>
        </div>
      )}
    </>
  );
}

export default CatalogContent;
