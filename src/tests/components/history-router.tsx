import { useState, useLayoutEffect, ReactNode } from 'react';
import { Router } from 'react-router-dom';
import { BrowserHistory } from 'history';

type HistoryRouterProps = {
  basename?: string;
  history: BrowserHistory;
  children?: ReactNode;
}

function HistoryRouter({ basename, history, children }: HistoryRouterProps) {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      location={state.location}
      navigator={history}
      navigationType={state.action}
    >
      {children}
    </Router>
  );
}

export default HistoryRouter;
