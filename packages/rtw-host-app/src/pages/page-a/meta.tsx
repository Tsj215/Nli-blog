import { MenuDataItem } from '@ant-design/pro-layout';

export const id = 'page-a';

export const menu: () => MenuDataItem[] = () => [
  {
    path: `${id}/test`,
    name: '测试',
    authority: ['admin'],
  },
];
