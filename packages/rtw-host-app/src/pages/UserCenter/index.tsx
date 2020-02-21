import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { SettingUser } from './containers/SettingUser';
import { UserProfile } from './containers/UserProfile';

export default withRouter(({ match: { path } }) => (
  <Switch>
    <Route exact={true} path={`${path}/user-profile`} component={UserProfile} />
    <Route exact={true} path={`${path}/user-setting`} component={SettingUser} />
    <Redirect to={`${path}/user-profile`} />
  </Switch>
));
