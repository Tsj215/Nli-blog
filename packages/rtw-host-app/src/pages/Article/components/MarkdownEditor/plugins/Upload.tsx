import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { Button, Icon, Modal, Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import _ from 'lodash';
import React from 'react';
import { PluginComponent, PluginProps } from 'react-markdown-editor-lite';
import { connect } from 'react-redux';

import {
  deleteByKey,
  deleteImage,
  getDownloadUrl,
  getQiniuToken,
  saveImage,
} from '@/apis';
import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import * as S from '@/schema';

import * as styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_o4psvd9gq0g.js',
});

interface UploadPicState {
  uploadToken?: string;
  key?: string;
  url?: string;
  loading: boolean;
  visible: boolean;
  previewImage?: string;
  previewVisible: boolean;
  fileList: S.Image[];
  uploadImageList: S.Image[];
}

interface UploadPicProps extends PluginProps {
  imageList: S.Image[];
  setImageList: (imageList: S.Image[]) => void;
}

class UploadPicCom extends PluginComponent<UploadPicState, UploadPicProps> {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'upload';
  // 定义按钮被防止在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'left';

  constructor(props: UploadPicProps) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadImageList: [],
    };
  }

  componentWillReceiveProps(nextProps: UploadPicProps) {
    if (nextProps.imageList.length > 0) {
      this.setState({ fileList: nextProps.imageList });
    }
  }

  beforeUpload = async (file: RcFile): Promise<any> => {
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isLt10M) {
      message.error('最大上传10M');
      return false;
    }
    const uploadToken = await getQiniuToken();

    this.setState({ uploadToken, key: file.name });
  };

  onChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      if (!this.state.loading) {
        message.loading('上传中', 0);
        this.setState({ loading: true });
      }
    }
    if (info.file.status === 'done') {
      message.destroy();
      message.success('上传成功');
      const url = await getDownloadUrl(info.file.name);
      const respImage = await saveImage({ name: info.file.name, url });

      const { fileList } = this.state;

      fileList.push(respImage);

      this.setState({ loading: false, fileList });
      this.props.setImageList(fileList);
      this.editor.insertMarkdown('image', {
        target: info.file.name,
        imageUrl: url,
      });
    }
  };

  handleModal = () => {
    this.setState({ visible: true });
  };

  removeFile = (file: S.Image) => {
    const { fileList } = this.state;

    _.pull(fileList, file);

    this.setState({ fileList });
    this.props.setImageList(fileList);
  };

  renderFileList = () => {
    const { fileList } = this.state;
    return (
      <div>
        {(fileList || []).map((f, i) => (
          <div key={i} className={styles.fileList}>
            <div>
              <IconFont type="icon-file" />
              <Button
                type="link"
                onClick={() =>
                  this.setState({ previewImage: f.url, previewVisible: true })
                }
              >
                <Ellipsis length={50}>{f.name}</Ellipsis>
              </Button>
            </div>
            <IconFont
              type="icon-delete"
              className={styles.delete}
              onClick={async () => {
                await deleteByKey(f.name);
                await deleteImage(f.id);
                this.removeFile(f);
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  render() {
    const {
      uploadToken,
      visible,
      previewVisible,
      previewImage,
      key,
    } = this.state;

    return (
      <span className={styles.button}>
        <Upload
          showUploadList={false}
          onChange={this.onChange}
          action="http://upload.qiniup.com"
          data={{ token: uploadToken, key }}
          beforeUpload={this.beforeUpload}
        >
          <IconFont
            type="icon-image"
            className={styles.icon}
            style={{ marginRight: 10 }}
          />
        </Upload>
        <Button
          type="link"
          className={styles.modal}
          onClick={this.handleModal}
          disabled={_.isEmpty(this.state.fileList)}
        >
          <IconFont
            type="icon-image_list1"
            className={styles.icon}
            style={{
              // stylelint-disable-next-line function-name-case
              color: _.isEmpty(this.state.fileList) ? '#bdbdbd' : '#757575',
            }}
          />
        </Button>
        <Modal
          footer={false}
          closable={false}
          visible={visible}
          style={{ top: 10 }}
          onCancel={() => this.setState({ visible: false })}
        >
          {this.renderFileList()}
        </Modal>
        <Modal
          footer={false}
          centered={true}
          closable={false}
          visible={previewVisible}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </span>
    );
  }
}

export const UploadPic = connect(
  (state: IState) => ({
    imageList: state.blog.article.imageList,
  }),
  {
    setImageList: articleActions.setImageList,
  },
)(UploadPicCom);
