import { Tag } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import { HandleTags } from 'rtw-components/src';

const { CheckableTag } = Tag;

export interface ArticleTagProps extends RouteComponentProps {
  tagList: string[];

  checkedTags: (checkedTags: string[]) => void;
}

export interface ArticleTagState {
  // 是否全选
  checkedAll: boolean;
  // 根据 length 判断是否已经全选
  checkedList: string[];
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

  onCheckedAll = async (checkedAll: boolean) => {
    const { tagList, checkedTags } = this.props;

    this.setState({ checkedAll });

    if (checkedAll) {
      await this.setState({ checkedList: tagList });
    } else {
      await this.setState({ checkedList: [] });
    }

    checkedTags(this.state.checkedList);
  };

  onCheckedChange = async (checked: boolean, value: string) => {
    const { checkedList } = this.state;
    const { tagList, checkedTags } = this.props;

    if (checked) {
      checkedList.push(value);
      await this.setState({ checkedList });
    } else {
      await this.setState({ checkedList: _.without(checkedList, value) });
    }

    if (tagList.length === this.state.checkedList.length) {
      await this.setState({ checkedAll: true });
    } else {
      await this.setState({ checkedAll: false });
    }

    checkedTags(this.state.checkedList);
  };

  render() {
    const { tagList } = this.props;
    const { checkedList } = this.state;

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
            onChange={this.onCheckedChange}
            checked={_.includes(checkedList, t)}
          >
            {t}
          </HandleTags>
        ))}
      </>
    );
  }
}

export const ArticleTag = connect((_state: IState) => ({}), {
  loadArticleByTags: articleActions.loadArticleByTags,
})(withRouter(ArticleTagComp));
