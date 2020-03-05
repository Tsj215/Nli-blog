import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
// import * as S from '@/schema';

import * as styles from './index.less';

export interface BarsProps extends RouteComponentProps {}

export interface BarsState {}

export class BarsComp extends React.Component<BarsProps, BarsState> {
  constructor(props: BarsProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={styles.container}>Bars</div>;
  }
}

export const Bars = connect((_state: IState) => ({}), {})(withRouter(BarsComp));
