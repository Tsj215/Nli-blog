import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';

import * as styles from './index.less';

export interface SettingUserProps extends RouteComponentProps {}

export interface SettingUserState {}

class SettingUserComp extends React.Component<
  SettingUserProps,
  SettingUserState
> {
  constructor(props: SettingUserProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={styles.container}>SettingUser</div>;
  }
}

export const SettingUser = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(SettingUserComp));
