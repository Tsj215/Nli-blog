import { Button, Form, Icon, Input, Modal, Popover, Tag, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { newArticle, newTag } from '@/apis';
import { IState } from '@/ducks';
import { tagActions } from '@/pages/article/ducks/tag';
import { history } from '@/skeleton';
import { HandleTags, PageHeader } from 'rtw-components/src';

import { MarkdownEditor } from '../../components/MarkdownEditor';

import * as styles from './index.less';

export interface NewArticleProps extends FormComponentProps {
  tagList: string[];
  loadTagList: () => void;
}

export interface NewArticleState {
  title: string;
  isVisible: boolean;
  // 判断已选标签是否超过 5 个
  addTag: boolean;
  // 富文本编辑器默认内容
  mdValue: any;
  // 已选标签
  selectedTags: string[];
  // 是否发布
  isSubmit: boolean;
}

export class NewArticleComp extends React.Component<
  NewArticleProps,
  Partial<NewArticleState>
> {
  constructor(props: NewArticleProps) {
    super(props);

    this.state = {
      title: null,
      addTag: true,
      selectedTags: [],
      isSubmit: false,
      isVisible: false,
      mdValue: '## 九山八海为一世界',
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.loadTagList();
  };

  addTag = () => {
    const { tagList } = this.props;
    const { selectedTags } = this.state;

    const title = (
      <div className={styles.popTitle}>
        <span>还可添加 {5 - selectedTags.length} 个标签</span>
        <span>
          找不到标签?
          <Button
            type="link"
            size="small"
            style={{ fontSize: 14 }}
            onClick={() => {
              this.setState({ isVisible: true });
            }}
          >
            创建
          </Button>
        </span>
      </div>
    );
    const content = (
      <div style={{ maxWidth: 280 }}>
        <HandleTags
          tagList={tagList}
          handletype="select"
          selectTags={this.selectTags}
        />
      </div>
    );

    return (
      <Popover
        title={title}
        trigger="click"
        content={content}
        placement="bottomLeft"
        arrowPointAtCenter={false}
      >
        <Tag
          style={{
            cursor: 'pointer',
            borderStyle: 'dashed',
            backgroundColor: '#fff',
          }}
        >
          <Icon type="plus" />
          添加标签
        </Tag>
      </Popover>
    );
  };

  selectTags = async (tag: string) => {
    const { selectedTags } = this.state;

    if (selectedTags.length < 5) {
      await this.setState({ addTag: true });
    }
    if (this.state.addTag) {
      selectedTags.push(tag);
      await this.setState({ selectedTags: _.uniq(selectedTags) });
      this.state.selectedTags.length == 5 && this.setState({ addTag: false });
    }
  };

  deleteTags = (tag: string) => {
    const { selectedTags } = this.state;
    this.setState({ selectedTags: _.pull(selectedTags, tag) });
  };

  onChange = (type: 'mdValue' | 'title') => (value: any) => {
    this.setState({
      [type]: type === 'title' ? value.target.value : value.text,
    });
  };

  showModal = () => {
    const { isVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="创建标签"
        closable={false}
        visible={isVisible}
        onOk={() => {
          this.props.form.validateFields(async (err, val) => {
            if (!err) {
              const resp = await newTag(val);

              if (resp) {
                this.onRefresh();
                message.success('新建成功');
                this.setState({ isVisible: false });
              } else {
                message.error('新建失败');
              }
            }
          });
        }}
        onCancel={() => {
          this.props.form.resetFields();
          this.setState({ isVisible: false });
        }}
      >
        <Form>
          <Form.Item>
            {getFieldDecorator('tagName', {
              rules: [
                { required: true, message: '请输入标签名称' },
                { max: 10, message: '标签最长10字' },
              ],
            })(<Input placeholder="请输入标签名称" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  submitArticle = async () => {
    const { title, selectedTags, mdValue } = this.state;
    if (_.isEmpty(title) || _.isEmpty(selectedTags) || _.isEmpty(mdValue)) {
      message.error('输入标题、选择标签、写入文章');
    } else {
      const resp = newArticle(title, selectedTags, mdValue);
      if (resp) {
        message.success('发布成功');
        this.setState({ isSubmit: true });
      }
    }
  };

  render() {
    const { title, selectedTags, mdValue, isSubmit } = this.state;

    return (
      <div className={styles.container}>
        <PageHeader
          title="新建文章"
          onBack={() => history.goBack()}
          style={{ backgroundColor: '#fff' }}
        />
        <div className={styles.content}>
          <div className={styles.actions}>
            <Input
              value={title}
              placeholder="请输入文章标题"
              style={{ marginRight: 16 }}
              onChange={this.onChange('title')}
            />
            <Button disabled={isSubmit} onClick={this.submitArticle}>
              发布文章
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              type="danger"
              onClick={() =>
                this.setState({
                  title: '',
                  mdValue: '',
                  isSubmit: false,
                  selectedTags: [],
                })
              }
            >
              重置
            </Button>
          </div>
          <div className={styles.selectTags}>
            {this.addTag()}
            {selectedTags.length !== 0 && (
              <HandleTags
                handletype="show"
                tagList={selectedTags}
                deleteTags={this.deleteTags}
              />
            )}
          </div>
          <MarkdownEditor mdValue={mdValue} onChange={this.onChange} />
        </div>
        {this.showModal()}
      </div>
    );
  }
}

export const NewArticle = connect(
  (state: IState) => ({
    tagList: state.blog.tag.tagList,
  }),
  {
    loadTagList: tagActions.loadTagList,
  },
)(Form.create<NewArticleProps>()(NewArticleComp));
