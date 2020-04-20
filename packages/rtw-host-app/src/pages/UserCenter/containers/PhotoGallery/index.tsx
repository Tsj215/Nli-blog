import { Button, Icon, Radio, Upload, message } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import _ from 'lodash';
import * as React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import Gallery from 'react-photo-gallery';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { addPhoto, deletePhotos, getDownloadUrl, getQiniuToken } from '@/apis';
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
  isEditPhoto: boolean;
  isShowLightBox: boolean;
  selectedPhotoNames: string[];
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
      isUploading: false,
      isEditPhoto: false,
      isShowLightBox: false,
      selectedPhotoNames: [],
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
      const image = new Image();
      const url = await getDownloadUrl(info.file.response.key);

      image.src = url;
      image.onload = async () => {
        await addPhoto(info.file.name, url, image.width, image.height);
        this.props.onRefresh();
        message.success('上传成功');
      };
    }
  };

  handleLightBox = (__: any, { index }: { index: number }) => {
    this.setState({ isShowLightBox: true, currentPhoto: index });
  };

  handlePhotoGallery = (photo: any) => {
    const { selectedId, selectedPhotoNames } = this.state;

    if (_.includes(selectedId, photo.id)) {
      this.setState({
        selectedId: _.pull(selectedId, photo.id),
        selectedPhotoNames: _.pull(selectedPhotoNames, photo.name),
      });
    } else {
      selectedId.push(photo.id);
      selectedPhotoNames.push(photo.name);
      this.setState({ selectedId, selectedPhotoNames });
    }
  };

  renderPhoto = ({ index, photo }: any) => {
    const { selectedId, isEditPhoto } = this.state;
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
          onClick={
            isEditPhoto
              ? () => this.handlePhotoGallery(photo)
              : () => this.handleLightBox(_, { index })
          }
        />
      </div>
    );
  };

  render() {
    const { photos } = this.props;
    const { uploadToken, key, selectedId, selectedPhotoNames } = this.state;

    return (
      <div className={styles.container}>
        <div style={{ margin: '4px 20px 12px' }}>
          <Radio.Group
            buttonStyle="solid"
            defaultValue={false}
            onChange={e =>
              this.setState({
                isEditPhoto: e.target.value,
                selectedId: e.target.value ? this.state.selectedId : [],
              })
            }
          >
            <Radio.Button value={false}>预览</Radio.Button>
            <Radio.Button value={true}>编辑</Radio.Button>
          </Radio.Group>
          {this.state.isEditPhoto && (
            <Button
              type="danger"
              style={{ marginLeft: '20px' }}
              onClick={async () => {
                const resp = await deletePhotos(selectedId, selectedPhotoNames);
                resp && message.success('删除成功');
                this.props.onRefresh();
              }}
            >
              删除
            </Button>
          )}
          <Upload
            style={{ border: '1px solid red' }}
            showUploadList={false}
            action="http://upload.qiniup.com"
            onChange={this.onUploadChange}
            beforeUpload={this.beforeUpload}
            data={{ token: uploadToken, key }}
          >
            <Button style={{ marginLeft: '20px' }}>
              {this.state.isUploading ? (
                <Icon type="loading" />
              ) : (
                <Icon type="upload" />
              )}
              上传图片
            </Button>
          </Upload>
        </div>
        <Gallery
          margin={6}
          photos={(photos || []).map(p => ({
            id: p.id,
            src: p.url,
            name: p.name,
            width: p.width,
            height: p.height,
            sizes: ['(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw'],
          }))}
          renderImage={this.renderPhoto}
        />

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
