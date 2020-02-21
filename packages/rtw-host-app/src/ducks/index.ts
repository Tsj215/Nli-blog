import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { ReducersMapObject, combineReducers } from 'redux';

// import { ArticleState, articleReducer } from '@/pages/Article/ducks';
import { MoCloudState, moCloudReducer } from '@/pages/MoCloud/ducks';
import { UserState, userReducer } from '@/pages/UserCenter/ducks';

import commonReducer, { IState as CommonState } from './common';

export interface IState {
  common: CommonState;
  user: UserState;
  moCloud: MoCloudState;
  // article: ArticleState;
}

export const configReducer = (partialReducers: ReducersMapObject = {}) => (
  history: History,
) =>
  combineReducers({
    common: commonReducer,
    user: userReducer,
    moCloud: moCloudReducer,
    // article: articleReducer,
    router: connectRouter(history),
    ...partialReducers,
  });
