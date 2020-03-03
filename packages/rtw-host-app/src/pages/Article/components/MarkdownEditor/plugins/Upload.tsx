import { Icon, Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import React from 'react';
import { PluginComponent, PluginProps } from 'react-markdown-editor-lite';

import { getDownloadUrl, getQiniuToken } from '@/apis';

import * as styles from './index.less';

interface UploadPicState {
  uploadToken?: string;
  key?: string;
  url?: string;
}

interface UploadPicProps extends PluginProps {}

export default class UploadPic extends PluginComponent<
  UploadPicState,
  UploadPicProps
> {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'upload';
  // 定义按钮被防止在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'left';

  constructor(props: UploadPicProps) {
    super(props);

    this.state = {};
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

  onChange = async (info: { file: UploadFile }) => {
    console.log(info.file);
    if (info.file.status === 'done') {
      const url = await getDownloadUrl(info.file.name);
      this.editor.insertMarkdown('image', {
        target: info.file.name,
        imageUrl: url,
      });
    }
  };

  render() {
    const { uploadToken, key } = this.state;
    return (
      <span className={styles.button}>
        <Upload
          showUploadList={false}
          onChange={this.onChange}
          action="http://upload.qiniup.com"
          data={{ token: uploadToken, key }}
          beforeUpload={this.beforeUpload}
        >
          <Icon type="picture" theme="filled" className={styles.icon} />
        </Upload>
      </span>
    );
  }
}
