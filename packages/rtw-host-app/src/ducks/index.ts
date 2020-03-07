import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { ReducersMapObject, combineReducers } from 'redux';

import { BlogState, blogReducer } from '@/pages/article/ducks';
import { MoCloudState, moCloudReducer } from '@/pages/moCloud/ducks';
import { UserState, userReducer } from '@/pages/userCenter/ducks';

import commonReducer, { IState as CommonState } from './common';

export interface IState {
  common: CommonState;
  user: UserState;
  moCloud: MoCloudState;
  blog: BlogState;
}

export const configReducer = (partialReducers: ReducersMapObject = {}) => (
  history: History,
) =>
  combineReducers({
    common: commonReducer,
    user: userReducer,
    moCloud: moCloudReducer,
    blog: blogReducer,
    router: connectRouter(history),
    ...partialReducers,
  });
