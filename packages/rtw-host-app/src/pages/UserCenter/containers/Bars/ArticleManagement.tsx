import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';

import * as S from '@/schema';

interface ArticleListTableProps {
  articleList: S.Article[];
}

const columns: ColumnProps<S.Article>[] = [
  {
    key: '',
  },
];

export const ArticleListTable: React.FC<ArticleListTableProps> = ({
  articleList,
}) => {
  return (
    <Table<S.Article>
      columns={columns}
      dataSource={articleList}
      style={{ border: '1px solid red' }}
    />
  );
};
