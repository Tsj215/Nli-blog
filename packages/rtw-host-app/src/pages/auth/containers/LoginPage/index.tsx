import { Button, Icon, Input, message } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { loginByUsername } from '@/apis';
import Cloud from '@/assets/cloud2.svg';
import { IState } from '@/ducks';
// import * as S from '@/schema';

import * as styles from './index.less';

export interface LoginPageProps extends RouteComponentProps {}

export interface LoginPageState {
  username: string;
  password: string;
  [key: string]: string;
}

export class LoginPageComp extends React.Component<
  LoginPageProps,
  LoginPageState
> {
  constructor(props: LoginPageProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleInputValue = (type: 'username' | 'password') => (e: any) => {
    this.setState({ [type]: e.target.value });
  };

  handleLogin = async () => {
    const { username, password } = this.state;
    const resp = await loginByUsername(username, password);
    console.log('token', resp.token);
    if (resp.data.token) {
      window.location.href = '/';
      message.success('登录成功');
    } else if (resp.message.errors === 'User not found') {
      message.error('用户名或密码错误');
    }
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.header}>
            <Cloud />
            <span>NLi's Blog</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Input
              prefix={<Icon type="user" />}
              value={username}
              onChange={this.handleInputValue('username')}
            />
            <Input.Password
              prefix={<Icon type="lock" />}
              value={password}
              onChange={this.handleInputValue('password')}
            />
          </div>
          <Button
            block={true}
            style={{ height: 40 }}
            onClick={this.handleLogin}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}

export const LoginPage = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(LoginPageComp));
