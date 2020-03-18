import { Card, Carousel, Icon, Tag } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import MarkDownIt from 'markdown-it';
import * as React from 'react';
import { Link } from 'react-router-dom';

import * as S from '@/schema';

import * as styles from './index.less';

const mdParser = new MarkDownIt();

const format = 'YYYY-MM-DD HH:mm';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_lnfedak82x.js',
});

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
            <Tag key={i}>
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
          title={this.renderHeader()}
          style={{ flex: '1', margin: 12 }}
        >
          <Card.Meta
            description={
              <div
                style={{ maxWidth: 460, maxHeight: 125 }}
                dangerouslySetInnerHTML={{
                  __html: _.truncate(mdParser.render(article.content), {
                    length: 200,
                  }),
                }}
              />
            }
          />
        </Card>
        {isShowCarousel && (
          <div className={styles.carousel}>
            <Carousel dots={true}>
              <img src="https://picsum.photos/300/200" alt="" />
              <img src="https://picsum.photos/300/200" alt="" />
            </Carousel>
          </div>
        )}
      </div>
    );
  }
}
