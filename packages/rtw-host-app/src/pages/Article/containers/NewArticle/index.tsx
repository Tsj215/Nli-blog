import {
  Button,
  Form,
  Icon,
  Input,
  Modal,
  Popover,
  Tag,
  Upload,
  message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import BratfEditor, {
  BuiltInControlType,
  ExtendControlType,
} from 'braft-editor';
import 'braft-editor/dist/index.css';
import _ from 'lodash';
import * as React from 'react';
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
  editorState: any;
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
      editorState: BratfEditor.createEditorState('### 九山八海为一世界'),
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

  onChange = (type: 'editorState' | 'title') => (value: any) => {
    this.setState({
      [type]: type === 'title' ? value.target.value : value,
    });
  };

  buildPreviewHtml() {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `;
  }

  renderBraftEditor = () => {
    const { editorState } = this.state;
    const excludeControls: BuiltInControlType[] = [
      'media',
      'subscript',
      'superscript',
      'letter-spacing',
    ];

    const extendControls: ExtendControlType[] = [
      {
        key: 'custom-modal',
        type: 'modal',
        html: null,
        text: '预览',
        modal: {
          id: 'my-modal',
          title: '预览内容',
          width: 500,
          height: 700,
          showFooter: false,
          showConfirm: false,
          showCancel: false,
          children: (
            <div
              dangerouslySetInnerHTML={{ __html: this.buildPreviewHtml() }}
            />
          ),
        },
      },
      {
        key: 'upload',
        type: 'component',
        component: (
          <Upload accept="image/*" showUploadList={false}>
            <Button className="control-item button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </Button>
          </Upload>
        ),
      },
    ];

    return (
      <BratfEditor
        value={editorState}
        extendControls={extendControls}
        excludeControls={excludeControls}
        style={{ backgroundColor: '#fff' }}
        onChange={this.onChange('editorState')}
      />
    );
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
    const { title, selectedTags } = this.state;

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
          {this.renderBraftEditor()}
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
