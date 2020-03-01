import { MenuDataItem } from '@ant-design/pro-layout';

export const id = 'article';

export const menu: () => MenuDataItem[] = () => [
  {
    path: `${id}/list`,
    name: '文章列表',
  },
  {
    path: `${id}/new`,
    name: '新建文章',
    authority: ['admin'],
  },
  {
    path: `${id}/test`,
    name: '测试',
  },
];
