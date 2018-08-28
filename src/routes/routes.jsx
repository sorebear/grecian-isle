import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import App from '../../ui/App';
import Game from '../../ui/grecianIsle/Game';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/game/:id" component={Game} />
      {/* <Route component={NotFoundPage}/> */}
    </Switch>
  </Router>
);
