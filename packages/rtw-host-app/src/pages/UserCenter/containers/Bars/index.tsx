import { DatePicker, Input, Select, Tabs } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { tagActions } from '@/pages/article/ducks/tag';
import { PageHeader } from 'rtw-components/src';
// import * as S from '@/schema';

import * as styles from './index.less';

const { TabPane } = Tabs;
const { Option } = Select;

export interface BarsProps extends RouteComponentProps {
  tagList: string[];

  loadTagList: () => void;
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
    const { history } = this.props;
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
          <TabPane tab="文章管理" key="文章管理">
            文章管理
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
    tagList: state.article.tag.tagList,
  }),
  {
    loadTagList: tagActions.loadTagList,
  },
)(withRouter(BarsComp));
