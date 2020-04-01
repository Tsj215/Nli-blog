import { Button, Icon, Input, message } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { loginByUsername } from '@/apis';
import { IState } from '@/ducks';
import { userActions } from '@/pages/userCenter/ducks/profile';

import * as styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_krnjkfohr6g.js',
});

export interface LoginPageProps extends RouteComponentProps {
  loadProfile: (id: number) => void;
}

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

    if (resp.data.token) {
      message.success('登录成功');
      window.location.href = '/';
    } else if (resp.message.errors === 'User not found') {
      message.error('用户名或密码错误');
    }
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div>
            <Input
              value={username}
              className={styles.input}
              prefix={<IconFont type="icon-yonghuming" />}
              onChange={this.handleInputValue('username')}
            />
            <Input.Password
              value={password}
              className={styles.input}
              prefix={<IconFont type="icon-A-copy" />}
              onChange={this.handleInputValue('password')}
            />
          </div>
          <Button
            block={true}
            className={styles.loginBtn}
            onClick={this.handleLogin}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}

export const LoginPage = connect((_state: IState) => ({}), {
  loadProfile: userActions.loadProfile,
})(withRouter(LoginPageComp));
