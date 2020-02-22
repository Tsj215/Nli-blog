import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { ArticleDetail } from './containers/ArticleDetail';
import { ArticleList } from './containers/ArticleList';
import { NewArticle } from './containers/NewArticle';

export default withRouter(({ match: { path } }) => (
  <Switch>
    <Route exact={true} path={`${path}/list`} component={ArticleList} />
    <Route exact={true} path={`${path}/detail`} component={ArticleDetail} />
    <Route exact={true} path={`${path}/new`} component={NewArticle} />
    <Redirect to={`${path}/list`} />
  </Switch>
));
