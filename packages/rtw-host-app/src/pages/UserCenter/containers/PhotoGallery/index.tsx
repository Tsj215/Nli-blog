import { Icon, Upload, message } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import _ from 'lodash';
import * as React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import Gallery from 'react-photo-gallery';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { addPhoto, getDownloadUrl, getQiniuToken } from '@/apis';
import { IState } from '@/ducks';
import * as S from '@/schema';

import * as styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_61nija66ljl.js',
});

export interface PhotoGalleryProps extends RouteComponentProps {
  photos: S.Photo[];
  onRefresh: () => void;
}

export interface PhotoGalleryState {
  // 上传文件名称
  key?: string;
  uploadToken?: string;

  selectedId: number[];
  currentPhoto: number;
  isUploading: boolean;
  isShowLightBox: boolean;
  isEditPhoto: boolean;
}

export class PhotoGalleryComp extends React.Component<
  PhotoGalleryProps,
  PhotoGalleryState
> {
  constructor(props: PhotoGalleryProps) {
    super(props);

    this.state = {
      selectedId: [],
      currentPhoto: 0,
      isEditPhoto: false,
      isUploading: false,
      isShowLightBox: false,
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

  handleLightBox = (__: any, { index }: { index: number }) => {
    console.log('index', index);
    this.setState({ isShowLightBox: true, currentPhoto: index });
  };

  handlePhotoGallery = (photo: any) => {
    const { selectedId } = this.state;

    if (_.includes(selectedId, photo.id)) {
      this.setState({ selectedId: _.pull(selectedId, photo.id) }, () =>
        console.log(this.state.selectedId),
      );
    } else {
      selectedId.push(photo.id);
      this.setState({ selectedId }, () => console.log(this.state.selectedId));
    }
  };

  renderPhoto = ({ index, photo }: any) => {
    const { selectedId } = this.state;
    const imgStyle = {
      transition:
        'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
    };
    const selectedImgStyle = {
      transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
      transition:
        'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
    };

    const isSelected = _.includes(selectedId, photo.id);

    const iconStyle: any = { display: 'none' };
    const selectedIconStyle = {
      top: '0',
      left: '0',
      zIndex: '1',
      fontSize: 24,
      position: 'absolute',
    };

    return (
      <div key={index} className={styles.renderPhoto}>
        <IconFont
          style={isSelected ? selectedIconStyle : iconStyle}
          type="icon-check4"
        />
        <img
          style={_.includes(selectedId, photo.id) ? selectedImgStyle : imgStyle}
          src={photo.src}
          width={photo.width}
          height={photo.height}
          onClick={() => this.handlePhotoGallery(photo)}
        />
      </div>
    );
  };

  render() {
    const { photos } = this.props;
    const { uploadToken, key } = this.state;

    return (
      <div className={styles.container}>
        <Gallery
          margin={6}
          photos={(photos || []).map(p => ({
            id: p.id,
            src: p.url,
            width: 1,
            height: 1,
            sizes: ['(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw'],
          }))}
          renderImage={this.renderPhoto}
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
        <ModalGateway>
          {this.state.isShowLightBox && (
            <Modal
              onClose={() =>
                this.setState({ currentPhoto: 0, isShowLightBox: false })
              }
            >
              <Carousel
                currentIndex={this.state.currentPhoto}
                views={(photos || []).map(p => ({ source: p.url }))}
              />
            </Modal>
          )}
        </ModalGateway>
      </div>
    );
  }
}

export const PhotoGallery = connect(
  (_state: IState) => ({}),
  {},
)(withRouter(PhotoGalleryComp));
