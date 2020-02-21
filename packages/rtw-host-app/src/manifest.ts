import { MenuDataItem } from '@ant-design/pro-layout';
import { ComponentType } from 'react';

// import { menu as PageAmenu } from '@/pages/page-a/meta';
import { menu as moyunMenu } from '@/pages/MoCloud/meta';

import { Home } from './pages/page-home/index';

export interface ResolvedModule {
  default: ComponentType<any>;
  reducer?: object;
}

export interface Module {
  type: 'page' | 'module' | 'app' | 'widget' | 'extension';
  component?: React.ComponentType;
  loader?: () => Promise<ResolvedModule>;
}

// menifest 包含了所有页面、模块、应用、控件、插件加载方式的声明，在索引时并不严格区分类型，而推荐按照唯一键索引即可，方便迁移。
// 自动注册为 `/:id` 的路由

export const getManifest = () => {
  return {
    'page-home': {
      id: 'page-home',
      type: 'app',
      component: Home,
    },
    moyun: {
      id: 'moyun',
      type: 'app',
      loader: () => import('./pages/MoCloud'),
    },
  };
};

export const getMenus = () => {
  const mapMenus = (menus: MenuDataItem[]) => {
    return menus.map(m => ({ ...m }));
  };

  const routes: MenuDataItem[] = [
    {
      key: 'page-home',
      icon: 'dashboard',
      path: '/page-home',
      name: 'Home',
      // children: mapMenus([]),
    },
    {
      key: 'moyun',
      icon: 'cloud',
      name: '莫云儿',
      authority: ['admin'],
      children: mapMenus([...moyunMenu()]),
    },
  ];

  return { name: 'Root', routes };
};

// declare global {
//   interface Window {
//     __DEV_APP__?: IAppModule;
//   }
// }

// 判断是否定义了开发应用
// if (window.__DEV_APP__) {
//   _manifest[window.__DEV_APP__.id] = {
//     ...window.__DEV_APP__,
//     type: 'app',
//     loader: () => importApp && importApp(window.__DEV_APP__!.module),
//   };
// }
