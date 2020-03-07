import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import { getArticleList } from '../../../apis';
import * as S from '../../../schema';

export interface IState {
  articleList: string[];
}

const initialState: IState = {
  articleList: [],
};

export const actions = createActions({
  async loadArticleList(
    pageNum: number,
    pageSize: number,
    article?: S.Article,
  ) {
    return getArticleList(pageNum, pageSize, article);
  },
});

export const articleActions = actions;

export default handleActions<IState, any>(
  {
    [actions.loadArticleList.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({
          ...prevState,
          articleList: payload,
        }),
      });
    },
  },
  initialState,
);
