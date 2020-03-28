import _ from 'lodash';
import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import {
  getArticleByTags,
  getArticleCntByCreateAt,
  getArticleList,
} from '../../../apis';
import * as S from '../../../schema';

export interface IState {
  articleList: S.Article[];
  articleCount: number;
  imageList: S.Image[];
  countArticle: S.CountArticle[];
}

const initialState: IState = {
  articleList: [],
  articleCount: 0,
  imageList: [],
  countArticle: [new S.CountArticle()],
};

export const actions = createActions({
  async loadArticleList(
    pageNum: number,
    pageSize: number,
    article?: S.ArticleParam,
  ) {
    return getArticleList(pageNum, pageSize, article);
  },

  async loadArticleByTags(pageNum: number, pageSize: number, tags?: S.Tag[]) {
    return getArticleByTags(pageNum, pageSize, tags);
  },

  async loadArticleCntByCreateAt() {
    return getArticleCntByCreateAt();
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

    [actions.loadArticleCntByCreateAt.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({
          ...prevState,
          countArticle: payload,
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
