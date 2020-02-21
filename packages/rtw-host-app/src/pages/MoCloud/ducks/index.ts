import { combineReducers } from 'redux';

import moCloudMsgReducer, { IState as moCloudState } from './moCloud';

export interface MoCloudState {
  moCloudMsg: moCloudState;
}

export const moCloudReducer = combineReducers({
  moCloudMsg: moCloudMsgReducer,
});
