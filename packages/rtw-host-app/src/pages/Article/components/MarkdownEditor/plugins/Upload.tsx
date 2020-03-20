import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { Button, Icon, Modal, Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import _ from 'lodash';
import React from 'react';
import { PluginComponent, PluginProps } from 'react-markdown-editor-lite';
import { connect } from 'react-redux';

import { deleteByKey, getDownloadUrl, getQiniuToken } from '@/apis';
import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';

import * as styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_o4psvd9gq0g.js',
});

interface ImageUrl {
  name: string;
  url: string;
}

interface UploadPicState {
  uploadToken?: string;
  key?: string;
  url?: string;
  loading: boolean;
  visible: boolean;
  previewImage?: string;
  previewVisible: boolean;
  fileList: ImageUrl[];
}

interface UploadPicProps extends PluginProps {
  imgUrlList: ImageUrl[];
  setImgUrl: (imgUrlList: ImageUrl[]) => void;
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
      fileList: [
        {
          name: '123.jpg',
          url: '123.jpg',
        },
        {
          name: 'ddddddddd23.jpg',
          url: 'http://tsj_online.com/123.jpg',
        },
        {
          name: '123.jpg',
          url: 'http://tsj_online.com/123.jpg',
        },
      ],
    };
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

      const { fileList } = this.state;
      fileList.push({ name: info.file.name, url });

      this.setState({ loading: false, fileList });
      this.props.setImgUrl(fileList);
      this.editor.insertMarkdown('image', {
        target: info.file.name,
        imageUrl: url,
      });
    }
  };

  handleModal = () => {
    this.setState({ visible: true });
  };

  removeFile = (file: ImageUrl) => {
    const { fileList } = this.state;

    _.pull(fileList, file);

    this.setState({ fileList });
    this.props.setImgUrl(fileList);
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
        <IconFont
          type="icon-image_list1"
          onClick={this.handleModal}
          className={styles.icon}
        />
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
    imgUrlList: state.blog.article.imgUrlList,
  }),
  {
    setImgUrl: articleActions.setImgUrl,
  },
)(UploadPicCom);
