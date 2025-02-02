import { Helmet } from 'react-helmet-async';
import Spinner from '../../components/spinner';

function LoadingPage(): JSX.Element {
  return (
    <div className="user-page">
      <Helmet>
        <title>WTW: Loading</title>
      </Helmet>

      <div style={{ display: 'grid', alignItems: 'center', flexGrow: 1 }}>
        <Spinner />
      </div>
    </div>
  );
}

export default LoadingPage;
