import { Avatar, Icon, Menu, Modal, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { logout } from '@/apis';
import { CurrentUser } from '@/models/UserModel';
import { getToken } from '@/skeleton/auth/token';
import { history } from '@/skeleton/env/history';
import { LoginPage } from '@/pages/auth/containers/LoginPage';

import HeaderDropdown from '../HeaderDropdown';

import styles from './index.less';

export interface GlobalHeaderRightProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

export class UserDropdown extends React.Component<GlobalHeaderRightProps> {
  state = {
    visible: false,
    login: false,
  };

  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      history.push('/');
      logout();
      return;
    } else if (key === 'login') {
      this.setState({ visible: true });
      return;
    } else if (key === 'center') {
      history.push('/user/profile');
      return;
    } else if (key === 'settings') {
      history.push('/user/setting');
      return;
    } else if (key === 'bars') {
      history.push('/user/bars');
      return;
    }

    history.push(`/`);
  };

  render(): React.ReactNode {
    const token = getToken();
    const { currentUser = { avatarUrl: '', name: '' }, menu } = this.props;

    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.onMenuClick}
      >
        {menu && token && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage
              id="menu.account.center"
              defaultMessage="个人中心"
            />
          </Menu.Item>
        )}
        {menu && !token && (
          <Menu.Item key="login">
            <Icon type="login" />
            <FormattedMessage id="menu.account.login" defaultMessage="登录" />
          </Menu.Item>
        )}
        {menu && token && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage
              id="menu.account.settings"
              defaultMessage="个人设置"
            />
          </Menu.Item>
        )}
        {menu && token && (
          <Menu.Item key="bars">
            <Icon type="bars" />
            <FormattedMessage
              id="menu.account.bars"
              defaultMessage="后台管理"
            />
          </Menu.Item>
        )}
        {menu && token && <Menu.Divider />}

        {menu && token && (
          <Menu.Item key="logout">
            <Icon type="logout" />
            <FormattedMessage id="menu.account.logout" defaultMessage="登出" />
          </Menu.Item>
        )}
      </Menu>
    );

    return currentUser && currentUser.name ? (
      token ? (
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.avatarUrl}
              alt="avatar"
            />
            <span className={styles.name}>{currentUser.name}</span>
          </span>
        </HeaderDropdown>
      ) : (
        <>
          <span
            className={`${styles.action} ${styles.account}`}
            onClick={() => this.setState({ visible: true })}
            onMouseEnter={() => this.setState({ login: true })}
            onMouseLeave={() => this.setState({ login: false })}
          >
            {!this.state.login ? (
              <div style={{ width: 70 }}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.avatarUrl}
                  alt="avatar"
                />
                <span className={styles.name}>{currentUser.name}</span>
              </div>
            ) : (
              <span
                style={{
                  width: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0,0,0,.65)',
                }}
              >
                <Icon style={{ marginRight: 6 }} type="login" />
                <Texty>登录</Texty>
              </span>
            )}
          </span>
          <Modal
            footer={false}
            closable={false}
            visible={this.state.visible}
            onCancel={() => this.setState({ visible: false })}
          >
            <LoginPage />
          </Modal>
        </>
      )
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
