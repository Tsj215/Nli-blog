import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { TestCom } from './containers/TestCom';

export default withRouter(({ match: { path } }) => {
  return (
    <Switch>
      <Route exact={true} path={`/module/test`} component={TestCom} />
      <Redirect to={`${path}/message`} />
    </Switch>
  );
});
