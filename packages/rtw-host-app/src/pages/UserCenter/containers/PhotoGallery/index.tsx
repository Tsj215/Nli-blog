import { Icon, Upload, message } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import _ from 'lodash';
import * as React from 'react';
import Gallery from 'react-photo-gallery';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { addPhoto, getDownloadUrl, getQiniuToken } from '@/apis';
import { IState } from '@/ducks';
import * as S from '@/schema';

import * as styles from './index.less';

export interface PhotoGalleryProps extends RouteComponentProps {
  photos: S.Photo[];
  onRefresh: () => void;
}

export interface PhotoGalleryState {
  // 上传文件名称
  key?: string;
  uploadToken?: string;

  isUploading: boolean;
}

export class PhotoGalleryComp extends React.Component<
  PhotoGalleryProps,
  PhotoGalleryState
> {
  constructor(props: PhotoGalleryProps) {
    super(props);

    this.state = {
      isUploading: false,
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

  onUploadChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      this.setState({ isUploading: true });
    }
    if (info.file.status !== 'uploading') {
      this.setState({ isUploading: false });
    }
    if (info.file.status === 'done') {
      message.success('上传成功');
      const url = await getDownloadUrl(info.file.response.key);
      await addPhoto(info.file.name, url);
      this.props.onRefresh();
    }
  };

  render() {
    const { photos } = this.props;
    const { uploadToken, key } = this.state;

    return (
      <div className={styles.container}>
        <Gallery
          margin={2}
          photos={(photos || []).map(p => ({
            src: p.url,
            width: p.width,
            height: p.height,
          }))}
        />
        <Upload
          listType="picture-card"
          showUploadList={false}
          action="http://upload.qiniup.com"
          onChange={this.onUploadChange}
          beforeUpload={this.beforeUpload}
          data={{ token: uploadToken, key }}
        >
          {this.state.isUploading ? (
            <Icon type="loading" />
          ) : (
            <Icon type="plus" />
          )}
        </Upload>
      </div>
    );
  }
}

export const PhotoGallery = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(PhotoGalleryComp));
