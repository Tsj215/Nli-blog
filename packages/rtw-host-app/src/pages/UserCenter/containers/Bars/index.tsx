import { DatePicker, Input, Select, Tabs } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import { tagActions } from '@/pages/article/ducks/tag';
import * as S from '@/schema';
import { history } from '@/skeleton';
import { PageHeader } from 'rtw-components/src';

import { ArticleListTable } from './ArticleManagement';
import { TagsManagement } from './TagsManagement';

import * as styles from './index.less';

const { TabPane } = Tabs;
const { Option } = Select;

export interface BarsProps {
  tagList: S.Tag[];
  articlecount: number;
  articleList: S.Article[];

  loadTagList: () => void;
  loadArticleList: (
    pageNum: number,
    pageSize: number,
    article?: Partial<S.ArticleParam>,
  ) => void;
}

export interface BarsState {
  subTitle: string;
  tags: S.Tag[];
  title: string;
  pageNum: number;
  pageSize: number;
  from: string;
  to: string;
}

export class BarsComp extends React.Component<BarsProps, BarsState> {
  constructor(props: BarsProps) {
    super(props);

    this.state = {
      subTitle: '文章管理',
      tags: [],
      title: null,
      pageNum: 0,
      pageSize: 10,
      from: null,
      to: null,
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    const { pageNum, pageSize, title, tags, from, to } = this.state;

    this.props.loadTagList();
    this.props.loadArticleList(pageNum, pageSize, { title, tags, from, to });
  };

  onTabChange = (key: string) => {
    this.setState({ subTitle: key });
  };

  filter = () => {
    const { tagList } = this.props;
    const { pageNum, pageSize, title, tags, from, to } = this.state;
    return (
      <div className={styles.filter}>
        <Input.Search
          allowClear={true}
          placeholder="文章标题"
          style={{ width: 300 }}
          onSearch={(title: string) => {
            this.setState({ title });
            this.props.loadArticleList(pageNum, pageSize, {
              title,
              tags,
              from,
              to,
            });
          }}
        />
        <Select
          allowClear={true}
          style={{ width: 100, margin: '0 18px' }}
          // onChange={(v: string) => {
          //   this.setState({ tags: v ? [v] : [] });
          //   this.props.loadArticleList(pageNum, pageSize, {
          //     from,
          //     to,
          //     title,
          //     tags: v ? [v] : [],
          //   });
          // }}
          onChange={val => console.log(val)}
        >
          {(tagList || []).map(t => (
            <Option value={t.id} key={t.id}>
              {t.content}
            </Option>
          ))}
        </Select>
        <DatePicker.RangePicker
          allowClear={true}
          onChange={(_: any, dateString: string[]) => {
            this.setState({
              from: dateString[0] ? dateString[0] : '',
              to: dateString[1]
                ? dayjs(dateString[1])
                    .add(1, 'day')
                    .format('YYYY-MM-DD')
                : '',
            });
            this.props.loadArticleList(pageNum, pageSize, {
              title,
              tags,
              from: dateString[0] ? dateString[0] : '',
              to: dateString[1]
                ? dayjs(dateString[1])
                    .add(1, 'day')
                    .format('YYYY-MM-DD')
                : '',
            });
          }}
        />
      </div>
    );
  };

  onPaginationChange = (pageNum: number, pageSize: number) => {
    const { tags, title, from, to } = this.state;
    this.setState({ pageNum: pageNum - 1, pageSize });
    this.props.loadArticleList(pageNum - 1, pageSize, {
      tags,
      title,
      from,
      to,
    });
  };

  render() {
    const { subTitle } = this.state;
    const { articlecount } = this.props;
    const pagination = {
      total: articlecount,
      showSizeChanger: true,
      onChange: this.onPaginationChange,
      onShowSizeChange: this.onPaginationChange,
    };

    return (
      <div className={styles.container}>
        <PageHeader
          title="后台管理"
          subTitle={subTitle}
          onBack={() => history.goBack()}
        />
        {this.filter()}
        <Tabs defaultActiveKey="文章管理" onChange={this.onTabChange}>
          <TabPane tab="文章管理" key="文章管理" style={{ paddingTop: 12 }}>
            {/* 文章管理 */}
            <ArticleListTable
              onRefresh={this.onRefresh}
              articleList={this.props.articleList}
              pagination={pagination}
            />
          </TabPane>
          <TabPane tab="标签管理" key="标签管理">
            {/* 标签管理 */}
            <TagsManagement />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export const Bars = connect(
  (state: IState) => ({
    tagList: state.blog.tag.tagList,
    articleList: state.blog.article.articleList,
    articlecount: state.blog.article.articleCount,
  }),
  {
    loadTagList: tagActions.loadTagList,
    loadArticleList: articleActions.loadArticleList,
  },
)(BarsComp);
