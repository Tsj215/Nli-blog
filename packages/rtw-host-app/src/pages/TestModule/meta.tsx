import { MenuDataItem } from '@ant-design/pro-layout';

export const id = 'module';

export const menu: () => MenuDataItem[] = () => [
  {
    path: `${id}/test`,
    name: '测试模块',
    authority: ['admin'],
  },
];
