import { MenuDataItem } from '@ant-design/pro-layout';

export const id = 'moyun';

export const menu: () => MenuDataItem[] = () => [
  {
    path: `${id}/message`,
    name: '晚安留言',
    authority: ['admin'],
  },
];
