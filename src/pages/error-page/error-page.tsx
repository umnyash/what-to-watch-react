import SiteHeader from '../../components/site-header';
import ErrorMessage from '../../components/error-message';

type ErrorPageProps = {
  text: string;
  onRetryButtonClick: () => void;
}

function ErrorPage({ text, onRetryButtonClick }: ErrorPageProps): JSX.Element {
  return (
    <div className="user-page">
      <SiteHeader className="user-page__head" withUserNavigation />
      <ErrorMessage
        text={text}
        onRetryButtonClick={onRetryButtonClick}
      />
    </div>
  );
}

export default ErrorPage;
