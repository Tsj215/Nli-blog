import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import { getProfileById } from '@/apis';
import * as S from '@/schema';

export interface IState {
  profile: S.UserProfile;
}

const initialState: IState = {
  profile: new S.UserProfile(),
};

export const actions = createActions({
  async loadProfile(id: number) {
    return getProfileById(id);
  },
});

export const userActions = actions;

export default handleActions<IState, any>(
  {
    [actions.loadProfile.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({ ...prevState, profile: payload }),
      });
    },
  },
  initialState,
);
