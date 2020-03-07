import { combineReducers } from 'redux';

import articleReducer, { IState as articleState } from './blog';
import tagReducer, { IState as tagState } from './tag';

export interface BlogState {
  tag: tagState;
  article: articleState;
}

export const blogReducer = combineReducers({
  tag: tagReducer,
  article: articleReducer,
});
