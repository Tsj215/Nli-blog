import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { Exception404, getToken } from '@/skeleton';

import { ArticleDetail } from './containers/ArticleDetail';
import { ArticleList } from './containers/ArticleList';
import { NewArticle } from './containers/NewArticle';

const token = getToken();

export default withRouter(({ match: { path } }) => (
  <Switch>
    <Route exact={true} path={`${path}/list`} component={ArticleList} />
    {token && (
      <Route exact={true} path={`${path}/new`} component={NewArticle} />
    )}
    <Route exact={true} path={`${path}/detail`} component={ArticleDetail} />
    <Route component={() => <Exception404 />} />
  </Switch>
));
