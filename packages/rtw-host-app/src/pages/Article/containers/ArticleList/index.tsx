import { BackTop, Divider, Pagination } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import { tagActions } from '@/pages/article/ducks/tag';
import * as S from '@/schema';

import { ArticleCard } from '../../components/ArticleCard';
import { ArticleTag } from '../ArticleTags';

import * as styles from './index.less';

export interface ArticleListProps extends RouteComponentProps {
  tagList?: string[];
  articleCount: number;
  articleList: S.Article[];

  loadTagList: () => void;
  loadArticleByTags: (
    pageNum: number,
    pageSize: number,
    tags?: string[],
  ) => void;
}

export interface ArticleListState {
  checkedTags: string[];
  pageNum: number;
  pageSize: number;
}

export class ArticleListComp extends React.Component<
  ArticleListProps,
  ArticleListState
> {
  constructor(props: ArticleListProps) {
    super(props);

    this.state = {
      checkedTags: [],
      pageNum: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.loadTagList();
    this.props.loadArticleByTags(0, 10);
  };

  setCheckedTags = (checkedTags: string[]) => {
    const { pageNum, pageSize } = this.state;
    this.setState({ checkedTags });
    this.onPaginatinChange(pageNum, pageSize);
  };

  onPaginatinChange = async (pageNum: number, pageSize: number) => {
    const { checkedTags } = this.state;
    await this.setState({ pageNum, pageSize });
    this.props.loadArticleByTags(pageNum - 1, pageSize, checkedTags);
  };

  render() {
    const { tagList, articleList, articleCount } = this.props;

    return (
      <div className={styles.f}>
        <BackTop visibilityHeight={100} />
        <div className={styles.s}>
          <div className={styles.selectTag}>
            <span>所属标签：</span>
            <ArticleTag tagList={tagList} checkedTags={this.setCheckedTags} />
            <Divider dashed={true} style={{ marginTop: 16 }} />
          </div>
          <div className={styles.content}>
            {(articleList || []).map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Pagination onChange={this.onPaginatinChange} total={articleCount} />
        </div>
      </div>
    );
  }
}

export const ArticleList = connect(
  (state: IState) => ({
    tagList: state.blog.tag.tagList,
    articleList: state.blog.article.articleList,
    articleCount: state.blog.article.articleCount,
  }),
  {
    loadTagList: tagActions.loadTagList,
    loadArticleByTags: articleActions.loadArticleByTags,
  },
)(withRouter(ArticleListComp));
