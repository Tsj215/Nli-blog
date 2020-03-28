import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { Avatar, BackTop, Button, Card, Divider, Icon, Pagination } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import QueueAnim from 'rc-queue-anim';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { getArticleCntByCreateAt } from '@/apis';
import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import { tagActions } from '@/pages/article/ducks/tag';
import { userActions } from '@/pages/userCenter/ducks/profile';
import * as S from '@/schema';

import { ArticleCard } from '../../components/ArticleCard';
import { ArticleTag } from '../ArticleTags';

import * as styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_bzolvv1m7s8.js',
});

export interface ArticleListProps extends RouteComponentProps {
  tagList?: S.Tag[];
  articleCount: number;
  profile: S.UserProfile;
  articleList: S.Article[];
  countArticle: S.CountArticle[];

  loadTagList: () => void;
  loadProfile: (id: number) => void;
  loadArticleList: (
    pageNum: number,
    pageSize: number,
    article?: Partial<S.ArticleParam>,
  ) => void;
  loadArticleCntByCreateAt: () => void;
}

export interface ArticleListState {
  pageNum: number;
  pageSize: number;
  isHidden: boolean;
  checkedTags: S.Tag[];
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
      isHidden: true,
      checkedTags: [],
      isShowProfile: true,
    };
  }

  componentDidMount() {
    this.onRefresh();
    this.screenChange();
    getArticleCntByCreateAt();
  }

  onRefresh = () => {
    this.props.loadTagList();
    this.props.loadProfile(1);
    this.props.loadArticleList(0, 10);
    this.props.loadArticleCntByCreateAt();
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

  setCheckedTags = (checkedTags: S.Tag[]) => {
    const { pageNum, pageSize } = this.state;

    this.setState({ checkedTags });
    this.onPaginatinChange(pageNum, pageSize);
  };

  onPaginatinChange = async (pageNum: number, pageSize: number) => {
    const { checkedTags } = this.state;

    await this.setState({ pageNum, pageSize });
    this.props.loadArticleList(pageNum - 1, pageSize, { tags: checkedTags });
  };

  /** 侧边信息 */
  renderProfile = () => {
    const { isHidden } = this.state;
    const { profile, countArticle } = this.props;

    return (
      <div className={styles.cardList}>
        {/** 个人信息 */}
        <Card
          hoverable={true}
          className={styles.profile}
          loading={_.isNil(profile)}
        >
          <div className={styles.header}>
            <div className={styles.title}>
              <p>{profile.username}</p>
              <Ellipsis length={15} tooltip={true}>
                {profile.signature}
              </Ellipsis>
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
        {/** 文章归档 */}
        <Card hoverable={true} className={styles.articleInfo}>
          <div className={styles.header}>
            <span>文章归档</span>
            <IconFont type="icon-placeFile" />
          </div>
          <Divider style={{ margin: '0 0 12px 0' }} />
          <div>
            <div
              style={
                isHidden
                  ? { height: '50px', overflow: 'hidden' }
                  : { overflow: 'visible', height: 'auto' }
              }
            >
              {(countArticle || []).map((a, i) => (
                <Button
                  key={i}
                  type="link"
                  className={styles.content}
                  onClick={() =>
                    this.props.loadArticleList(0, 10, {
                      from: dayjs(a.date)
                        .startOf('month')
                        .format('YYYY-MM-DD'),
                      to: dayjs(a.date)
                        .startOf('month')
                        .add(1, 'month')
                        .format('YYYY-MM-DD'),
                    })
                  }
                >
                  <span>{dayjs(a.date).format('YYYY 年 MM 月')}</span>
                  <span>{a.count} 篇</span>
                </Button>
              ))}
            </div>
            {isHidden && (
              <Button
                type="link"
                style={{ width: '100%' }}
                onClick={() => this.setState({ isHidden: false })}
              >
                <IconFont type="icon-zhankai1" />
              </Button>
            )}
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
            <QueueAnim
              duration={400}
              leaveReverse={true}
              type={['right', 'left']}
            >
              {(articleList || []).map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </QueueAnim>
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
    countArticle: state.blog.article.countArticle,
    articleList: state.blog.article.articleList,
    articleCount: state.blog.article.articleCount,
  }),
  {
    loadTagList: tagActions.loadTagList,
    loadProfile: userActions.loadProfile,
    loadArticleList: articleActions.loadArticleList,
    loadArticleCntByCreateAt: articleActions.loadArticleCntByCreateAt,
  },
)(withRouter(ArticleListComp));
