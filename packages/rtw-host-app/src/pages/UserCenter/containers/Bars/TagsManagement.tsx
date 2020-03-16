import { Card, Icon, Input, Modal, Popconfirm, message } from 'antd';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { deleteTag, newTag, updateTag } from '@/apis';
import { IState } from '@/ducks';
import { tagActions } from '@/pages/article/ducks/tag';

import * as styles from './TagsManagement.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_kh3i3lo8xx.js',
});

export interface TagsManagementProps extends RouteComponentProps {
  tagList: string[];
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

  deleteTags = async (tag: string) => {
    await deleteTag(tag);
    this.onRefresh();
  };

  handleTag = async (type: 'new' | 'edit', tagName?: string) => {
    if (type === 'new') {
      await newTag(this.state.tagName);
      this.onRefresh();
      this.setState({ tagName: '', visible: false });
      message.success('创建成功');
    } else {
      await updateTag(tagName, this.state.tagName);
      await this.setState({ tagName: '', [tagName]: false });
      this.onRefresh();
      message.success('编辑成功');
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ tagName: e.target.value });
  };

  renderCard = (tag: string) => {
    const actions: React.ReactNode[] = [
      !this.state[tag] ? (
        <Popconfirm
          key="delete"
          title="确定删除吗"
          onConfirm={() => this.deleteTags(tag)}
        >
          <IconFont type="icon-delete" />
        </Popconfirm>
      ) : (
        <IconFont
          type="icon-check"
          onClick={() => this.handleTag('edit', tag)}
        />
      ),
      !this.state[tag] ? (
        <IconFont
          key="icon-edit"
          type="icon-edit3"
          onClick={() => this.setState({ [tag]: true, tagName: tag })}
        />
      ) : (
        <IconFont
          type="icon-cancel"
          onClick={() => this.setState({ [tag]: false, tagName: '' })}
        />
      ),
    ];
    return (
      <Card
        key={tag}
        actions={actions}
        className={styles.card}
        cover={
          <IconFont
            type={`icon-${_.toLower(tag)}`}
            style={{ fontSize: 80, marginTop: 16 }}
          />
        }
      >
        {!this.state[tag] && (
          <Card.Meta className={styles.cardMeta} title={tag} />
        )}
        {this.state[tag] && (
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
