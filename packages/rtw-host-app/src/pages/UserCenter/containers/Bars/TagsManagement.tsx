import { Card, Icon, Input, Modal, Popconfirm, message } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { deleteTag, newTag, updateTag } from '@/apis';
import { IState } from '@/ducks';
import { tagActions } from '@/pages/article/ducks/tag';
import * as S from '@/schema';

import * as styles from './TagsManagement.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_lnfedak82x.js',
});

export interface TagsManagementProps extends RouteComponentProps {
  tagList: S.Tag[];
  loadTagList: () => void;
}

export interface TagsManagementState {
  visible: boolean;
  tagName: string;
  [key: string]: boolean | any;
}

export class TagsManagementComp extends React.Component<
  TagsManagementProps,
  TagsManagementState
> {
  constructor(props: TagsManagementProps) {
    super(props);

    this.state = {
      tagName: '',
      visible: false,
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.loadTagList();
  };

  deleteTags = async (tagId: number) => {
    await deleteTag(tagId);
    this.onRefresh();
  };

  handleTag = async (type: 'new' | 'edit', tagId?: number) => {
    if (type === 'new') {
      await newTag(this.state.tagName);
      this.onRefresh();
      this.setState({ tagName: '', visible: false });
      message.success('创建成功');
    } else {
      await updateTag(tagId, this.state.tagName);
      await this.setState({ tagName: '', [tagId]: false });
      this.onRefresh();
      message.success('编辑成功');
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ tagName: e.target.value });
  };

  renderCard = (tag: S.Tag) => {
    const actions: React.ReactNode[] = [
      !this.state[tag.id] ? (
        <Popconfirm
          key="delete"
          title="确定删除吗"
          onConfirm={() => this.deleteTags(tag.id)}
        >
          <IconFont type="icon-delete" />
        </Popconfirm>
      ) : (
        <IconFont
          type="icon-check"
          onClick={() => this.handleTag('edit', tag.id)}
        />
      ),
      !this.state[tag.id] ? (
        <IconFont
          key="icon-edit"
          type="icon-edit3"
          onClick={() =>
            this.setState({ [tag.id]: true, tagName: tag.content })
          }
        />
      ) : (
        <IconFont
          type="icon-cancel"
          onClick={() => this.setState({ [tag.id]: false, tagName: '' })}
        />
      ),
    ];
    return (
      <Card
        key={tag.id}
        actions={actions}
        style={{ width: 200 }}
        className={styles.card}
        cover={
          <IconFont
            type={`icon-${_.toLower(tag.content)}`}
            style={{ fontSize: 80, marginTop: 16 }}
          />
        }
      >
        {!this.state[tag.id] && (
          <Card.Meta className={styles.cardMeta} title={tag.content} />
        )}
        {this.state[tag.id] && (
          <Input
            size="small"
            onChange={this.onInputChange}
            defaultValue={this.state.tagName}
          />
        )}
      </Card>
    );
  };

  showModal = () => {
    const { visible, tagName } = this.state;
    return (
      <Modal
        title="创建标签"
        closable={false}
        visible={visible}
        onOk={() => this.handleTag('new')}
        onCancel={() => this.setState({ visible: false })}
        okButtonProps={{ disabled: _.isEmpty(tagName) }}
      >
        <Input
          maxLength={20}
          value={tagName}
          allowClear={true}
          style={{ height: 32 }}
          placeholder="请输入标签名"
          onChange={this.onInputChange}
        />
      </Modal>
    );
  };

  render() {
    const { tagList } = this.props;

    return (
      <div className={styles.container}>
        {(tagList || []).map(t => this.renderCard(t))}
        <div
          className={styles.newTag}
          onClick={() => this.setState({ visible: true })}
        >
          <IconFont style={{ fontSize: 85 }} type="icon-add1" />
        </div>
        {this.showModal()}
      </div>
    );
  }
}

export const TagsManagement = connect(
  (state: IState) => ({
    tagList: state.blog.tag.tagList,
  }),
  {
    loadTagList: tagActions.loadTagList,
  },
)(withRouter(TagsManagementComp));
