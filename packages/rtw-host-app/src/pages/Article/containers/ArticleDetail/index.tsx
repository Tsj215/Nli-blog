import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { IState } from '@/ducks';

import * as styles from './index.less';

export interface ArticleDetailProps
  extends RouteComponentProps<{ articleId: string }> {}

export interface ArticleDetailState {}

class ArticleDetailCom extends React.Component<
  ArticleDetailProps,
  ArticleDetailState
> {
  get ArticleId() {
    return this.props.match.params.articleId;
  }

  constructor(props: ArticleDetailProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log(this.ArticleId);
  }

  render() {
    return <div className={styles.container}>ArticleDetail</div>;
  }
}

export const ArticleDetail = connect(
  (_state: IState) => ({}),
  {},
)(ArticleDetailCom);
