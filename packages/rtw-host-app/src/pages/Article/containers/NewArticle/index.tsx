import { Button, Form, Icon, Input, Modal, Popover, Tag, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import MarkdownIt from 'markdown-it';
import * as React from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { connect } from 'react-redux';

import { newTag } from '@/apis';
import { IState } from '@/ducks';
import { tagActions } from '@/pages/article/ducks/tag';
import { history } from '@/skeleton';
import { HandleTags, PageHeader } from 'rtw-components/src';

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
  mdEditorValue: string;
  // 已选标签
  selectedTags: string[];
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
      isVisible: false,
      mdEditorValue: '### 九山八海为一世界',
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

  onChange = (type: 'mdEditorValue' | 'title') => (value: any) => {
    this.setState({
      [type]: type === 'title' ? value.target.value : value.text,
    });
  };

  handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = e => console.log(e.target.result);

    reader.readAsDataURL(file);
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

  render() {
    const mdParser = new MarkdownIt();
    const { title, selectedTags, mdEditorValue } = this.state;

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
            <Button onClick={() => message.success('发布成功')}>
              发布文章
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
          <MdEditor
            value={mdEditorValue}
            style={{ height: 480 }}
            renderHTML={text => mdParser.render(text)}
            onChange={this.onChange('mdEditorValue')}
            onImageUpload={this.handleImageUpload}
          />
        </div>
        {this.showModal()}
      </div>
    );
  }
}

export const NewArticle = connect(
  (state: IState) => ({
    tagList: state.article.tag.tagList,
  }),
  {
    loadTagList: tagActions.loadTagList,
  },
)(Form.create<NewArticleProps>()(NewArticleComp));
