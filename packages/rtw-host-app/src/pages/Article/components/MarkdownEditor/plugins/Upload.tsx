import { Icon, Upload } from 'antd';
import React from 'react';
import { PluginComponent, PluginProps } from 'react-markdown-editor-lite';

import * as styles from './index.less';

interface UploadPicState {}

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

  render() {
    console.log(this.editor);
    return (
      <span className={styles.button}>
        <Upload>
          <Icon
            onClick={() => {
              this.editor.insertMarkdown('image', {
                target: '456',
                imageUrl: '123',
              });
            }}
            type="picture"
            theme="filled"
            className={styles.icon}
          />
        </Upload>
      </span>
    );
  }
}
