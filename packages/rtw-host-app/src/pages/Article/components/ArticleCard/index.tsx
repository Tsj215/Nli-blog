import { Card, Carousel, Icon, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import _ from 'lodash';
import MarkDownIt from 'markdown-it';
import * as React from 'react';
import 'react-markdown-editor-lite/lib/index.css';
import { Link } from 'react-router-dom';

import * as S from '@/schema';

import * as styles from './index.less';

const format = 'YYYY-MM-DD HH:mm';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_lnfedak82x.js',
});

const mdParser: MarkDownIt = new MarkDownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },
}).disable('image');

interface ArticleCardProps {
  article: S.Article;
}

interface ArticleCardState {
  isShowCarousel: boolean;
}

export class ArticleCard extends React.Component<
  ArticleCardProps,
  ArticleCardState
> {
  constructor(props: ArticleCardProps) {
    super(props);
    this.state = {
      isShowCarousel: true,
    };
  }

  componentDidMount() {
    this.screenChange();
  }

  screenChange = () => {
    window.addEventListener('resize', this.handleChange);
  };

  handleChange = () => {
    const width = window.innerWidth;

    width < 850
      ? this.setState({ isShowCarousel: false })
      : this.setState({ isShowCarousel: true });
  };

  renderHeader = () => {
    const { article } = this.props;
    return (
      <div className={styles.header}>
        <Link className={styles.link} to={`/article/detail/${article.id}`}>
          {article.title}
        </Link>
        <div className={styles.tagList}>
          <Icon type="tags" />：
          {article.tags.map((t, i) => (
            <Tag key={i} style={{ marginBottom: 6 }}>
              <IconFont
                type={`icon-${_.toLower(t)}`}
                style={{ marginRight: 8 }}
              />
              {t}
            </Tag>
          ))}
        </div>
      </div>
    );
  };

  public render(): JSX.Element {
    const { article } = this.props;
    const { isShowCarousel } = this.state;

    const actions = [
      <div key="time">
        <IconFont type="icon-icon-time" style={{ marginRight: 6 }} />
        <span>{dayjs(article.createAt).format(format)}</span>
      </div>,
      <div key="eye">
        <IconFont type="icon-eye1" style={{ marginRight: 6 }} />
        <span>1.0k</span>
      </div>,
      <div key="like">
        <IconFont type="icon-like" style={{ marginRight: 6 }} />
        <span>50</span>
      </div>,
    ];

    return (
      <div className={styles.container}>
        <Card
          hoverable={true}
          bordered={false}
          actions={actions}
          title={
            <Skeleton
              active={true}
              paragraph={false}
              title={{ width: 150 }}
              loading={!!!this.props.article.title}
            >
              {this.renderHeader()}
            </Skeleton>
          }
          className={styles.card}
        >
          <Card.Meta
            description={
              <Skeleton
                active={true}
                paragraph={{ rows: 3 }}
                loading={!!!this.props.article.content}
              >
                {
                  <div
                    className="custom-html-style html-wrap"
                    dangerouslySetInnerHTML={{
                      __html: _.truncate(
                        mdParser.render(_.get(article, 'content', '')),
                        { length: 350 },
                      ),
                    }}
                  />
                }
              </Skeleton>
            }
          />
        </Card>
        {isShowCarousel && !_.isEmpty(article.images) && (
          <div className={styles.carousel}>
            <Carousel dots={true} easing="ease-out">
              {(article.images || []).map(i => (
                <img
                  key={i.id}
                  style={{ maxHeight: 200 }}
                  src={`${i.url}?imageView2/2/h/200`}
                />
              ))}
            </Carousel>
          </div>
        )}
      </div>
    );
  }
}
