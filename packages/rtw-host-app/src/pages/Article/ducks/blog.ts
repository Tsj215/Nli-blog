import _ from 'lodash';
import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';

import { getArticleByTags, getArticleList } from '../../../apis';
import * as S from '../../../schema';

interface ImageUrl {
  name: string;
  url: string;
}

export interface IState {
  articleList: S.Article[];
  articleCount: number;
  imgUrlList: ImageUrl[];
}

const initialState: IState = {
  articleList: [],
  articleCount: 0,
  imgUrlList: [],
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

  setImgUrl(imgList: ImageUrl[]) {
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

    [actions.setImgUrl.toString()](state: IState, action) {
      const { payload } = action;

      return { ...state, imgUrlList: payload };
    },
  },
  initialState,
);
