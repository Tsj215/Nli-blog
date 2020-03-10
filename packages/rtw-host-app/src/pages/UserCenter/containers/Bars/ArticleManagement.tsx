import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { Button, Divider, Table, Tag } from 'antd';
import { ColumnProps } from 'antd/es/table';
import dayjs from 'dayjs';
import React from 'react';

import * as S from '@/schema';

import * as styles from './ArticleManagement.less';

interface ArticleListTableProps {
  articleList: S.Article[];
}

const columns: ColumnProps<S.Article>[] = [
  {
    align: 'center',
    key: 'title',
    title: '标题',
    dataIndex: 'title',
  },
  {
    align: 'center',
    key: 'content',
    title: '内容',
    dataIndex: 'content',
    render: t => <Ellipsis length={20}>{t}</Ellipsis>,
  },
  {
    align: 'center',
    key: 'tags',
    title: '标签',
    dataIndex: 'tags',
    render: (t: string[]) => (t || []).map(i => <Tag key={i}>{i}</Tag>),
  },
  {
    align: 'center',
    key: 'createAt',
    title: '创建时间',
    dataIndex: 'createAt',
    render: c => dayjs(c).format('YYYY/MM/DD HH:mm'),
  },
  {
    align: 'center',
    key: 'edit',
    title: '编辑',
    render: () => (
      <div>
        <Button type="link">删除</Button>
        <Divider type="vertical" />
        <Button type="link">编辑</Button>
      </div>
    ),
  },
];

export const ArticleListTable: React.FC<ArticleListTableProps> = ({
  articleList,
}) => {
  return (
    <div className={styles.container}>
      <Table<S.Article> columns={columns} dataSource={articleList} />;
    </div>
  );
};
