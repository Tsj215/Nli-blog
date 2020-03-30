import { Tag } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import * as S from '@/schema';
import { HandleTags } from 'rtw-components/src';

const { CheckableTag } = Tag;

export interface ArticleTagProps extends RouteComponentProps {
  tagList: S.Tag[];
  checkedList: S.Tag[];

  onCheckedChange: () => void;
  handleCheckedTags: (tags: S.Tag[]) => void;
}

export interface ArticleTagState {
  // 是否全选
  checkedAll: boolean;
}

export class ArticleTagComp extends React.Component<
  ArticleTagProps,
  ArticleTagState
> {
  constructor(props: ArticleTagProps) {
    super(props);

    this.state = {
      checkedAll: false,
    };
  }

  onCheckedAll = async (checkedAll: boolean) => {
    const { tagList, onCheckedChange, handleCheckedTags } = this.props;

    this.setState({ checkedAll });

    if (checkedAll) {
      await handleCheckedTags(tagList);
    } else {
      await handleCheckedTags([]);
    }

    onCheckedChange();
  };

  onCheckedChange = async (checked: boolean, value: S.Tag) => {
    const {
      tagList,
      onCheckedChange,
      checkedList,
      handleCheckedTags,
    } = this.props;

    if (checked) {
      checkedList.push(value);
      await handleCheckedTags(checkedList);
    } else {
      await handleCheckedTags(_.without(checkedList, value));
    }

    if (tagList.length === this.props.checkedList.length) {
      await this.setState({ checkedAll: true });
    } else {
      await this.setState({ checkedAll: false });
    }

    onCheckedChange();
  };

  render() {
    const { checkedList, tagList } = this.props;

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
            value={t}
            key={t.id}
            handletype="filter"
            onChange={this.onCheckedChange}
            checked={_.includes(checkedList, t)}
          />
        ))}
      </>
    );
  }
}

export const ArticleTag = connect((_state: IState) => ({}), {
  loadArticleByTags: articleActions.loadArticleByTags,
})(withRouter(ArticleTagComp));
