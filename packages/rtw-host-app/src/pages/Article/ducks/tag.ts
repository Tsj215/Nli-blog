import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import { getTagList } from '@/apis';
import * as S from '@/schema';

export interface IState {
  tagList: S.Tag[];
}

const initialState: IState = {
  tagList: [],
};

export const actions = createActions({
  async loadTagList() {
    return getTagList();
  },
});

export const tagActions = actions;

export default handleActions<IState, any>(
  {
    [actions.loadTagList.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({ ...prevState, tagList: payload }),
      });
    },
  },
  initialState,
);
