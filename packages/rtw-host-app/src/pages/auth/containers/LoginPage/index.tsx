import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
// import * as S from '@/schema';

import * as styles from './index.less';

export interface LoginPageProps extends RouteComponentProps {}

export interface LoginPageState {}

export class LoginPageComp extends React.Component<
  LoginPageProps,
  LoginPageState
> {
  constructor(props: LoginPageProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={styles.container}>LoginPage</div>;
  }
}

export const LoginPage = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(LoginPageComp));
