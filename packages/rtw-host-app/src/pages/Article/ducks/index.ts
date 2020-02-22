import { combineReducers } from 'redux';

import tagReducer, { IState as tagState } from './tag';

export interface ArticleState {
  tag: tagState;
}

export const articleReducer = combineReducers({
  tag: tagReducer,
});
