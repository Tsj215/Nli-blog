import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from '@/ducks';

import * as styles from './index.less';

export interface ArticleDetailProps {}

export interface ArticleDetailState {}

class ArticleDetailCom extends React.Component<
  ArticleDetailProps,
  ArticleDetailState
> {
  constructor(props: ArticleDetailProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={styles.container}>ArticleDetail</div>;
  }
}

export const ArticleDetail = connect(
  (_state: IState) => ({}),
  {},
)(ArticleDetailCom);
