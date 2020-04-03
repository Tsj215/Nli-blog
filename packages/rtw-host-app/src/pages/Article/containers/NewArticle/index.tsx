import { Button, Form, Icon, Input, Modal, Popover, Tag, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { getArticleById, newArticle, newTag, updateArticle } from '@/apis';
import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import { tagActions } from '@/pages/article/ducks/tag';
import * as S from '@/schema';
import { history } from '@/skeleton';
import { HandleTags, PageHeader } from 'rtw-components/src';

import { MarkdownEditor } from '../../components/MarkdownEditor';

import * as styles from './index.less';

const EditContext: React.Context<{ articleId: string }> = React.createContext({
  articleId: '',
});

export const EditConsumer = EditContext.Consumer;

export interface NewArticleProps
  extends FormComponentProps,
    RouteComponentProps<{ articleId: string }> {
  tagList: S.Tag[];
  imageList: S.Image[];

  loadTagList: () => void;
  setImageList: (imageList: S.Image[]) => void;
}

export interface NewArticleState {
  title: string;
  isVisible: boolean;
  // 判断已选标签是否超过 5 个
  addTag: boolean;
  // 富文本编辑器默认内容
  mdValue: any;
  // 已选标签
  selectedTags: S.Tag[];
  // 是否发布
  isSubmit: boolean;

  pageHeaderTitle: string;
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
      pageHeaderTitle: '新建文章',
    };
  }

  get articleId() {
    return this.props.match.params.articleId;
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = async () => {
    this.props.loadTagList();

    if (this.articleId) {
      const { title, tags, content, images } = await getArticleById(
        _.toNumber(this.articleId),
      );
      this.props.setImageList(images);
      this.setState({
        title,
        mdValue: content,
        selectedTags: tags,
        pageHeaderTitle: '编辑文章',
      });
    }
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

  selectTags = (tag: S.Tag) => {
    const { selectedTags } = this.state;

    console.log('tag', tag);

    if (selectedTags.length < 5) {
      this.setState({ addTag: true });
    }
    if (this.state.addTag) {
      selectedTags.push(tag);
      this.setState({ selectedTags: _.uniq(selectedTags) }, () => {
        this.state.selectedTags.length == 5 && this.setState({ addTag: false });
      });
    }
  };

  deleteTags = (tagId: number) => {
    const { selectedTags } = this.state;
    this.setState({
      selectedTags: _.pull(
        selectedTags,
        selectedTags.filter(s => s.id === tagId)[0],
      ),
    });
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
              const resp = await newTag(val.tagName);

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
      let resp;
      if (!this.articleId) {
        resp = await newArticle(
          title,
          selectedTags,
          mdValue,
          this.props.imageList,
        );
      } else {
        resp = await updateArticle(
          _.toNumber(this.articleId),
          title,
          selectedTags,
          mdValue,
          this.props.imageList,
        );
      }
      if (resp) {
        !this.articleId
          ? message.success('发布成功')
          : message.success('更新成功');

        this.onRefresh();
        this.setState({ isSubmit: true });
      }
    }
  };

  render() {
    const {
      title,
      selectedTags,
      mdValue,
      isSubmit,
      pageHeaderTitle,
    } = this.state;

    return (
      <div className={styles.container}>
        <PageHeader
          title={pageHeaderTitle}
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
            <Button
              onClick={this.submitArticle}
              disabled={this.articleId ? false : isSubmit}
            >
              {this.articleId ? '更新文章' : '发布文章'}
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
          <EditContext.Provider value={{ articleId: this.articleId }}>
            <MarkdownEditor mdValue={mdValue} onChange={this.onChange} />
          </EditContext.Provider>
        </div>
        {this.showModal()}
      </div>
    );
  }
}

export const NewArticle = connect(
  (state: IState) => ({
    tagList: state.blog.tag.tagList,
    imageList: state.blog.article.imageList,
  }),
  {
    loadTagList: tagActions.loadTagList,
    setImageList: articleActions.setImageList,
  },
)(Form.create<NewArticleProps>()(NewArticleComp));
