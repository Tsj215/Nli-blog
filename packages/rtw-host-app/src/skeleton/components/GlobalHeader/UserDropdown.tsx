import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { logout } from '@/apis';
import { CurrentUser } from '@/models/UserModel';
import { getToken } from '@/skeleton/auth/token';
import { history } from '@/skeleton/env/history';

import HeaderDropdown from '../HeaderDropdown';

import styles from './index.less';

export interface GlobalHeaderRightProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

export class UserDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      logout();
      return;
    } else if (key === 'login') {
      history.push('/login');
      return;
    } else if (key === 'center') {
      history.push('/user/profile');
      return;
    } else if (key === 'settings') {
      history.push('/user/setting');
      return;
    }
    history.push(`/`);
  };

  render(): React.ReactNode {
    const token = getToken();
    const { currentUser = { avatar: '', name: '' }, menu } = this.props;

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
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.avatar}
            alt="avatar"
          />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
