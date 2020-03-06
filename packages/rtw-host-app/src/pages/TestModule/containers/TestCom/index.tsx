import { Tabs } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';

import * as styles from './index.less';

export interface TestComProps extends RouteComponentProps {}

export interface TestComState {}

export class TestComComp extends React.Component<TestComProps, TestComState> {
  constructor(props: TestComProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.container}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="tab1" key="1">
            tab1
          </Tabs.TabPane>
          <Tabs.TabPane tab="tab2" key="2">
            tab2
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export const TestCom = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(TestComComp));
