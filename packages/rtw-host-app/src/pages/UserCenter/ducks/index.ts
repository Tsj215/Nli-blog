import { combineReducers } from 'redux';

import profileReducer, { IState as profileState } from './profile';

export interface UserState {
  profile: profileState;
}

export const userReducer = combineReducers({
  profile: profileReducer,
});
