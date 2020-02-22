import { Divider } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { tagActions } from '@/pages/Article/ducks/tag';
import { userActions } from '@/pages/UserCenter/ducks/profile';

import { ArticleCard } from '../../components/ArticleCard';
import { ArticleTag } from '../ArticleTags';

import * as styles from './index.less';

export interface ArticleListProps extends RouteComponentProps {
  profile: any;
  tagList?: string[];

  loadTagList: () => void;
  loadProfile: (id: number) => void;
}

export interface ArticleListState {}

export class ArticleListComp extends React.Component<
  ArticleListProps,
  ArticleListState
> {
  constructor(props: ArticleListProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.loadTagList();
    this.props.loadProfile(1);
  };

  render() {
    const { tagList } = this.props;

    return (
      <div className={styles.f}>
        <div className={styles.s}>
          <div className={styles.selectTag}>
            <span>所属标签：</span>
            <ArticleTag tagList={tagList} />
            <Divider dashed={true} style={{ marginTop: 16 }} />
          </div>
          <div className={styles.content}>
            <ArticleCard />
            <Divider />
            <ArticleCard />
            <Divider />
            <ArticleCard />
          </div>
        </div>
      </div>
    );
  }
}

export const ArticleList = connect(
  (state: IState) => ({
    profile: state.user.profile,
    tagList: state.article.tag.tagList,
  }),
  {
    loadProfile: userActions.loadProfile,
    loadTagList: tagActions.loadTagList,
  },
)(withRouter(ArticleListComp));
