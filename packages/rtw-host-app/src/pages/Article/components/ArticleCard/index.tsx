import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { Card, Carousel, Icon, Tag } from 'antd';
import dayjs from 'dayjs';
import * as React from 'react';
import { Link } from 'react-router-dom';

import * as styles from './index.less';

const format = 'YYYY-MM-DD HH:mm';

interface ArticleCardProps {}

interface ArticleCardState {
  isShowCarousel: boolean;
}

const tagList: string[] = ['React', 'Redux', 'NestJs'];

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

  renderHeader = (title: string, tagList: string[]) => {
    return (
      <div className={styles.header}>
        <Link style={{ color: 'rgba(0,0,0,.65)' }} to={`/article/detail`}>
          {title}
        </Link>
        <div className={styles.tagList}>
          <Icon type="tags" />：
          {tagList.map((t, i) => (
            <Tag key={i}>{t}</Tag>
          ))}
        </div>
      </div>
    );
  };

  renderActions = () => {
    return (
      <div className={styles.actions}>
        <div key="clock-circle">
          <Icon type="clock-circle" style={{ marginRight: 6 }} />
          <span>{dayjs().format(format)}</span>
        </div>
        <div key="eye">
          <Icon type="eye" style={{ marginRight: 6 }} />
          <span>1.0k</span>
        </div>
        <div key="like">
          <Icon type="like" style={{ marginRight: 6 }} />
          <span>14</span>
        </div>
        <div key="message">
          <Icon type="message" style={{ marginRight: 6 }} />
          <span>50</span>
        </div>
      </div>
    );
  };

  public render(): JSX.Element {
    console.log(window.innerWidth);
    const { isShowCarousel } = this.state;

    return (
      <div className={styles.container}>
        <Card
          bordered={false}
          style={{ flex: '1' }}
          title={this.renderHeader('基于微前端实现个人博客', tagList)}
        >
          <Ellipsis length={300}>
            在现代的 Web
            应用中很多场景都需要运用到即时通讯，比如常见的扫码登录，聊天室，广播消息等。
            在过去，为了实现这种即时通讯（推送）通常都是使用Ajax轮询。轮询就是在指定的时间间隔内，进行HTTP
            请求来获取数据，而这种方式会产生一些弊端，一方面产生过多的HTTP请求，占用带宽，增大服务器的相应，浪费资源，另一方面，因为不是每一次请求都会有在现代的
            Web
            应用中很多场景都需要运用到即时通讯，比如常见的扫码登录，聊天室，广播消息等。
            在过去，为了实现这种即时通讯（推送）通常都是使用Ajax轮询。轮询就是在指定的时间间隔内，进行HTTP
            请求来获取数据，而这种方式会产生一些弊端，一方面产生过多的HTTP请求，占用带宽，增大服务器的相应，浪费资源，另一方面，因为不是每一次请求都会有在现代的
            Web
            应用中很多场景都需要运用到即时通讯，比如常见的扫码登录，聊天室，广播消息等。
            在过去，为了实现这种即时通讯（推送）通常都是使用Ajax轮询。轮询就是在指定的时间间隔内，进行HTTP
            请求来获取数据，而这种方式会产生一些弊端，一方面产生过多的HTTP请求，占用带宽，增大服务器的相应，浪费资源，另一方面，因为不是每一次请求都会有在现代的
            Web
          </Ellipsis>
          <div style={{ position: 'absolute', bottom: 0 }}>
            {this.renderActions()}
          </div>
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
