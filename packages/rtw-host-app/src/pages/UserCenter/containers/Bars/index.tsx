import { DatePicker, Input, Select, Tabs } from 'antd';
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

import * as styles from './index.less';

const { TabPane } = Tabs;
const { Option } = Select;

export interface BarsProps {
  articleList: S.Article[];
  tagList: string[];

  loadTagList: () => void;
  loadArticleList: (
    pageNum: number,
    pageSize: number,
    article?: S.Article,
  ) => void;
}

export interface BarsState {
  subTitle: string;
}

export class BarsComp extends React.Component<BarsProps, BarsState> {
  constructor(props: BarsProps) {
    super(props);

    this.state = {
      subTitle: '文章管理',
    };
  }

  componentDidMount() {
    this.props.loadTagList();
    this.props.loadArticleList(0, 10);
  }

  filter = () => {
    const { tagList } = this.props;
    return (
      <div className={styles.filter}>
        <Input.Search style={{ width: 300 }} allowClear={true} />
        <Select
          allowClear={true}
          defaultValue={_.head(tagList)}
          style={{ width: 100, margin: '0 18px' }}
        >
          {(tagList || []).map(t => (
            <Option value={t} key={t}>
              {t}
            </Option>
          ))}
        </Select>
        <DatePicker allowClear={true} />
      </div>
    );
  };

  onTabChange = (key: string) => {
    this.setState({ subTitle: key });
  };

  render() {
    const { subTitle } = this.state;
    return (
      <div className={styles.container}>
        <PageHeader
          title="后台管理"
          subTitle={subTitle}
          onBack={() => history.goBack()}
        />
        {this.filter()}
        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
          <TabPane tab="文章管理" key="文章管理" style={{ paddingTop: 24 }}>
            {/* 文章管理 */}
            <ArticleListTable articleList={[]} />
          </TabPane>
          <TabPane tab="标签管理" key="标签管理">
            标签管理
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
  }),
  {
    loadTagList: tagActions.loadTagList,
    loadArticleList: articleActions.loadArticleList,
  },
)(BarsComp);
