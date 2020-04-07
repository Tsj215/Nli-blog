import ProLayout, {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
} from '@ant-design/pro-layout';
import { Icon } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Logo from '@/assets/logo2.svg';
import { IState } from '@/ducks';
import { formatMessage } from '@/i18n';
import { getMenus } from '@/manifest';
import { userActions } from '@/pages/userCenter/ducks/profile';
import * as S from '@/schema';
import { checkPermissions } from '@/skeleton/auth';
import { getAuthority, setAuthority } from '@/skeleton/auth/authority';

import { RightContent } from '../components/GlobalHeader/RightContent';

import { NavContext } from './NavContext';

import * as styles from './index.less';

export interface NavLayoutProps extends ProLayoutProps {
  matchedPath: string;
  profile: S.UserProfile;
  children: any;

  loadProfile: (id: number) => void;
}

/**
 * use AuthorizedWrapper check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return checkPermissions(item.authority, localItem, null) as MenuDataItem;
  });

const defaultRenderCollapsedButton = (collapsed?: boolean) => (
  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
);

const footerRender: NavLayoutProps['footerRender'] = () => {
  return (
    <div
      style={{
        // textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 12,
      }}
    >
      <h3 style={{ marginRight: 16, fontSize: 14 }}>NLi，项目地址:</h3>
      <a href="https://github.com/Tsj215/Nli-blog">NLi'blog</a>
    </div>
  );
};

const NavLayoutCom: React.FC<Partial<NavLayoutProps>> = props => {
  const { children, matchedPath, profile, loadProfile } = props;
  const [authority, _setAuthority] = React.useState(getAuthority());

  const [collapse, toggleCollapse] = React.useState(true);

  const handleMenuCollapse = (payload: boolean): void => {
    console.log('collapse', payload);
    toggleCollapse(payload);
  };

  // 如果用户个人信息不存在，则进行加载
  if (!profile.avatarUrl) {
    localStorage.getItem('nli-token') && loadProfile(1);
  }

  return (
    <section>
      <NavContext.Provider
        value={{
          authority: authority,
          onAuthorityChange: (a: string[]) => {
            setAuthority(a);
            _setAuthority(a);
          },
        }}
      >
        <ProLayout
          className={styles.container}
          {...props}
          title={"Nli's Blog"}
          collapsed={collapse}
          layout="topmenu"
          route={getMenus() as any}
          logo={
            <div className={styles.logo}>
              <Logo />
              {collapse && <span>Nli's Blog</span>}
            </div>
          }
          siderWidth={240}
          navTheme={'light'}
          menuDataRender={menuDataRender}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl) {
              return defaultDom;
            }

            return (
              <Link
                style={{
                  // stylelint-disable-next-line function-name-case
                  color: _.startsWith(matchedPath || '', menuItemProps.path)
                    ? '#6874e2'
                    : 'rgba(0,0,0,.65)',
                }}
                to={menuItemProps.path}
              >
                {defaultDom}
              </Link>
            );
          }}
          collapsedButtonRender={_collapsed => {
            return (
              <span>
                <span>{defaultRenderCollapsedButton(_collapsed)}</span>
                <span style={{ marginLeft: 8, fontSize: 16 }}>展开菜单</span>
              </span>
            );
          }}
          breadcrumbRender={(routers = []) => {
            return [
              {
                path: '/',
                breadcrumbName: formatMessage({
                  id: 'menu.home',
                  defaultMessage: 'Home',
                }),
              },
              ...routers,
            ];
          }}
          itemRender={(route, _, routes, paths) => {
            const first = routes.indexOf(route) === 0;

            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={footerRender}
          formatMessage={formatMessage}
          rightContentRender={rightProps => (
            <RightContent profile={profile} {...rightProps} />
          )}
          onCollapse={handleMenuCollapse}
        >
          {children}
        </ProLayout>
      </NavContext.Provider>
    </section>
  );
};

export const NavLayout = connect(
  (state: IState) => ({
    profile: state.user.profile.profile,
  }),
  {
    loadProfile: userActions.loadProfile,
  },
)(NavLayoutCom);
