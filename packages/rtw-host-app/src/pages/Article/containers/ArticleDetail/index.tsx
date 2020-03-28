import { Anchor, Card, Divider, Icon, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import _ from 'lodash';
import MarkDownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-table-of-contents';
import QueueAnim from 'rc-queue-anim';
import * as React from 'react';
import 'react-markdown-editor-lite/lib/index.css';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import uslug from 'uslug';

import { getArticleById } from '@/apis';
import { IState } from '@/ducks';
import * as S from '@/schema';
import { PageHeader } from 'rtw-components/src';

import * as styles from './index.less';

const { Link } = Anchor;

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_9ji719bphi7.js',
});

export interface ArticleDetailProps
  extends RouteComponentProps<{ articleId: string }> {
  anchor: string[];
  setAnchor: (anchor: string) => void;
}

export interface ArticleDetailState {
  article: S.Article;
  anchor?: string[];
}

class ArticleDetailCom extends React.Component<
  ArticleDetailProps,
  ArticleDetailState
> {
  mdParser: MarkDownIt;
  _divRef: React.RefObject<HTMLDivElement>;

  get articleId() {
    return this.props.match.params.articleId;
  }

  constructor(props: ArticleDetailProps) {
    super(props);

    this._divRef = React.createRef<HTMLDivElement>();

    this.state = {
      article: new S.Article(),
    };

    this.mdParser = new MarkDownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }

        return '';
      },
    })
      .use(anchor, {
        slugify: (str: string) => uslug(str),
      })
      .use(toc);
  }

  async componentDidMount() {
    const article = await getArticleById(_.toNumber(this.articleId));

    this.setState({ article });
  }

  // 侧边文章信息
  renderArticleInfo = () => {
    const { article } = this.state;
    const articleTag = (article.tags || []).map(t => (
      <Tag key={t.id} style={{ marginBottom: 6 }}>
        <IconFont
          style={{ marginRight: 6 }}
          type={`icon-${_.toLower(t.content)}`}
        />
        {t.content}
      </Tag>
    ));

    return (
      <QueueAnim type="top">
        <Card key="articleInfo" className={styles.articleInfo}>
          <Card.Meta
            className={styles.cardMeta}
            title={article.title}
            description={
              <div>
                <div style={{ marginBottom: 6 }}>
                  <IconFont type="icon-tag3" style={{ fontSize: 17 }} />：
                  {articleTag}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <IconFont type="icon-eye1" style={{ marginRight: 6 }} />：
                  {article.visitTimes} 次浏览
                </div>
                <div style={{ marginBottom: 6 }}>
                  <IconFont type="icon-time" style={{ fontSize: 17 }} />：
                  {dayjs(article.createAt).format('YY/MM/DD HH:mm')}
                </div>
                {article.updateAt && (
                  <div>
                    <IconFont type="icon-update" style={{ fontSize: 17 }} />：
                    {dayjs(article.updateAt).format('YY/MM/DD HH:mm')}
                  </div>
                )}
              </div>
            }
          />
        </Card>
      </QueueAnim>
    );
  };

  renderAnchor = () => {
    const hArr = ['h1', 'h2', 'h3', 'h4', 'h5'];
    const hCollection = hArr.map(h =>
      this._divRef.current.getElementsByTagName(h),
    );

    const anchor = hCollection.map(h => _.map(h, a => a.id));
    return _.flatten(anchor);
  };

  render() {
    const { article } = this.state;

    return (
      <QueueAnim duration={500} type={['right', 'left']}>
        <div key="container" className={styles.container}>
          <PageHeader
            title="文章详情"
            style={{ backgroundColor: '#fff' }}
            backIcon={<IconFont type="icon-back" />}
            onBack={() => this.props.history.goBack()}
          />
          <div className={styles.content}>
            {/** 侧边栏 */}
            <div className={styles.left}>
              <div style={{ backgroundColor: '#fff', marginBottom: 24 }}>
                <Skeleton
                  active={true}
                  paragraph={{ width: 286 }}
                  loading={_.isNil(this.state.article.id)}
                >
                  {this.renderArticleInfo()}
                </Skeleton>
              </div>
              <div style={{ backgroundColor: '#fff' }}>
                <Skeleton
                  active={true}
                  paragraph={{ width: 286 }}
                  loading={
                    _.isNull(this._divRef.current)
                    // true
                  }
                >
                  {this._divRef.current && !_.isEmpty(this.renderAnchor()) && (
                    <QueueAnim type="bottom">
                      <div key="anchor" className={styles.anchor}>
                        <h3>
                          <IconFont
                            type="icon-mulu"
                            style={{ marginRight: 8 }}
                          />
                          目录
                        </h3>
                        <Divider style={{ margin: 0 }} />
                        <Anchor
                          className={styles.content}
                          onClick={e => e.preventDefault()}
                        >
                          {this.renderAnchor().map((a, i) => (
                            <Link
                              key={i}
                              href={`#${a}`}
                              title={_.truncate(a, { length: 16 })}
                            />
                          ))}
                        </Anchor>
                      </div>
                    </QueueAnim>
                  )}
                </Skeleton>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', width: '100%' }}>
              <Skeleton
                active={true}
                paragraph={{ rows: 14 }}
                loading={_.isNull(this.state.article.id)}
              >
                <div
                  ref={this._divRef}
                  className="custom-html-style html-wrap"
                  style={{
                    flex: '1 1 1px',
                    padding: 24,
                    backgroundColor: '#fff',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: this.mdParser.render(_.get(article, 'content', '')),
                  }}
                />
              </Skeleton>
            </div>
          </div>
        </div>
      </QueueAnim>
    );
  }
}

export const ArticleDetail = connect(
  (_state: IState) => ({}),
  {},
)(ArticleDetailCom);
