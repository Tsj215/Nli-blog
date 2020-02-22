import { Button } from 'antd';
import * as React from 'react';

import { history } from '@/skeleton/env/history';

import * as styles from './index.less';

export const Exception404 = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <p>Page Not Found</p>
      <span>
        Lorem ipsum dolor sit amet, consectetur
        <br /> adipiscing elit, sed do eiusmod tempor incididunt
        <br /> ut labore et dolore magna aliqua
      </span>
      <Button
        shape="round"
        className={styles.btn}
        onClick={() => history.push('/')}
      >
        Back
      </Button>
    </div>
    <div />
  </div>
);
