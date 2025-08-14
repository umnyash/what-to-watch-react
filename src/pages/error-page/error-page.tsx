import { Helmet } from 'react-helmet-async';
import { PageTitle } from '../../const';
import SiteHeader from '../../components/site-header';
import ErrorMessage from '../../components/error-message';

type ErrorPageProps = {
  title: PageTitle;
  text: string;
  onRetryButtonClick: () => void;
}

function ErrorPage({ title, text, onRetryButtonClick }: ErrorPageProps): JSX.Element {
  return (
    <div className="user-page">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <SiteHeader className="user-page__head" withUserNavigation />
      <ErrorMessage
        text={text}
        onRetryButtonClick={onRetryButtonClick}
      />
    </div>
  );
}

export default ErrorPage;
