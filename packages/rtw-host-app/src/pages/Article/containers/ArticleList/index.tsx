import { Avatar, BackTop, Card, Divider, Icon, Pagination } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import { tagActions } from '@/pages/article/ducks/tag';
import { userActions } from '@/pages/userCenter/ducks/profile';
import * as S from '@/schema';

import { ArticleCard } from '../../components/ArticleCard';
import { ArticleTag } from '../ArticleTags';

import * as styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_moszi2ku3d.js',
});

export interface ArticleListProps extends RouteComponentProps {
  tagList?: string[];
  articleCount: number;
  profile: S.UserProfile;
  articleList: S.Article[];

  loadProfile: (id: number) => void;
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
  isShowProfile: boolean;
}

export class ArticleListComp extends React.Component<
  ArticleListProps,
  ArticleListState
> {
  constructor(props: ArticleListProps) {
    super(props);

    this.state = {
      pageNum: 1,
      pageSize: 10,
      checkedTags: [],
      isShowProfile: true,
    };
  }

  componentDidMount() {
    this.onRefresh();
    this.screenChange();
  }

  onRefresh = () => {
    this.props.loadTagList();
    this.props.loadProfile(1);
    this.props.loadArticleByTags(0, 10);
  };

  screenChange = () => {
    window.addEventListener('resize', this.handleChange);
  };

  handleChange = () => {
    const width = window.innerWidth;

    width < 850
      ? this.setState({ isShowProfile: false })
      : this.setState({ isShowProfile: true });
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

  renderProfile = () => {
    const { profile } = this.props;

    return (
      <div className={styles.cardList}>
        <Card
          hoverable={true}
          className={styles.profile}
          loading={_.isNil(profile)}
        >
          <div className={styles.header}>
            <div className={styles.title}>
              <p>{profile.username}</p>
              <span>{_.truncate(profile.signature, { length: 15 })}</span>
            </div>
            <div>
              <Avatar src={profile.avatarUrl} />
            </div>
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div className={styles.profileContent}>
            <div>
              <Icon type="environment" className={styles.icon} />
              <span>{_.truncate(profile.address, { length: 25 })}</span>
            </div>
            <div>
              <Icon type="book" className={styles.icon} />
              <span>{_.truncate(profile.university, { length: 25 })}</span>
            </div>
            <div>
              <Icon type="mail" className={styles.icon} />
              <span>{_.truncate(profile.email, { length: 25 })}</span>
            </div>
            <div>
              <Icon type="github" className={styles.icon} />
              <span>{_.truncate(profile.github, { length: 25 })}</span>
            </div>
          </div>
        </Card>
        <Card hoverable={true} className={styles.articleInfo}>
          <div className={styles.header}>
            <span>文章归档</span>
            <IconFont type="icon-placeFile" />
          </div>
        </Card>
      </div>
    );
  };

  render() {
    const { tagList, articleList, articleCount } = this.props;

    return (
      <div className={styles.container}>
        <BackTop visibilityHeight={200} style={{ right: 40 }}>
          <IconFont
            type="icon-backTop"
            style={{ fontSize: 40, color: '#6874e2' }}
          />
        </BackTop>
        {this.state.isShowProfile && this.renderProfile()}
        <div className={styles.articleList}>
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
    profile: state.user.profile.profile,
    articleList: state.blog.article.articleList,
    articleCount: state.blog.article.articleCount,
  }),
  {
    loadTagList: tagActions.loadTagList,
    loadProfile: userActions.loadProfile,
    loadArticleByTags: articleActions.loadArticleByTags,
  },
)(withRouter(ArticleListComp));
