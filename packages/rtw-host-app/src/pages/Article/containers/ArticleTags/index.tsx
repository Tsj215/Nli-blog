import { Tag } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { HandleTags } from 'rtw-components/src';

const { CheckableTag } = Tag;

export interface ArticleTagProps extends RouteComponentProps {
  tagList: string[];
}

export interface ArticleTagState {
  // 是否全选
  checkedAll: boolean;
  // 根据 length 判断是否已经全选
  checkedList: string[];
  // 此处 number 作为 string
  [key: number]: boolean;
}

export class ArticleTagComp extends React.Component<
  ArticleTagProps,
  ArticleTagState
> {
  constructor(props: ArticleTagProps) {
    super(props);

    this.state = {
      checkedAll: false,
      checkedList: [],
    };
  }

  onCheckedChange = (checked: boolean, value: string) => {
    const { tagList } = this.props;
    const { checkedList } = this.state;

    this.setState({ [value as any]: checked });

    if (!_.includes(checkedList, value) && checked) {
      checkedList.push(value);
      this.setState({ checkedList });
    } else {
      _.pull(checkedList, value);
      this.setState({ checkedList });
    }

    checkedList.length === tagList.length
      ? this.setState({ checkedAll: true })
      : this.setState({ checkedAll: false });
  };

  onCheckedAll = (checked: boolean) => {
    const { tagList } = this.props;

    this.setState({ checkedAll: checked });

    checked
      ? tagList.map(t => this.setState({ [t as any]: true }))
      : tagList.map(t => this.setState({ [t as any]: false }));
  };

  render() {
    const { tagList } = this.props;

    return (
      <>
        <CheckableTag
          checked={this.state.checkedAll}
          onChange={this.onCheckedAll}
        >
          全选
        </CheckableTag>
        {(tagList || []).map(t => (
          <HandleTags
            key={t}
            value={t}
            handletype="filter"
            checked={this.state[t]}
            onChange={this.onCheckedChange}
          >
            {t}
          </HandleTags>
        ))}
      </>
    );
  }
}

export const ArticleTag = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(ArticleTagComp));
