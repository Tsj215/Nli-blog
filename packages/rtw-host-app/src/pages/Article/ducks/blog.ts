import _ from 'lodash';
import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import { getArticleByTags, getArticleList } from '../../../apis';
import * as S from '../../../schema';

export interface IState {
  articleList: S.Article[];
  articleCount: number;
  imageList: S.Image[];
}

const initialState: IState = {
  articleList: [],
  articleCount: 0,
  imageList: [],
};

export const actions = createActions({
  async loadArticleList(
    pageNum: number,
    pageSize: number,
    article?: S.ArticleParam,
  ) {
    return getArticleList(pageNum, pageSize, article);
  },

  async loadArticleByTags(pageNum: number, pageSize: number, tags?: string[]) {
    return getArticleByTags(pageNum, pageSize, tags);
  },

  setImageList(imgList: S.Image[]) {
    return imgList;
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
          articleList: payload.list,
          articleCount: payload.total,
        }),
      });
    },
    [actions.loadArticleByTags.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({
          ...prevState,
          articleList: payload.list,
          articleCount: payload.total,
        }),
      });
    },

    [actions.setImageList.toString()](state: IState, action) {
      const { payload } = action;

      return { ...state, imageList: payload };
    },
  },
  initialState,
);
