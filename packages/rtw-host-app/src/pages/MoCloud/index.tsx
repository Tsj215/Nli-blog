import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { MessageBoard } from './containers/MessageBoard';

export default withRouter(({ match: { path } }) => {
  return (
    <Switch>
      <Route exact={true} path={`${path}/message`} component={MessageBoard} />
      <Redirect to={`${path}/message`} />
    </Switch>
  );
});
