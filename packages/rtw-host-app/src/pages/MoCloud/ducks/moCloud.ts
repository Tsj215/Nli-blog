import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import { getMoCloudMsg } from '@/apis';
import * as S from '@/schema';

export interface IState {
  moCloudMsg: S.MoCloudMsg;
}

const initialState: IState = {
  moCloudMsg: new S.MoCloudMsg(),
};

export const actions = createActions({
  async loadMoCloudMsg() {
    return getMoCloudMsg();
  },
});

export const moCloudActions = actions;

export default handleActions<IState, any>(
  {
    [actions.loadMoCloudMsg.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({ ...prevState, moCloudMsg: payload }),
      });
    },
  },
  initialState,
);
