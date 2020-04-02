import {
  Avatar,
  Badge,
  Button,
  Descriptions,
  Icon,
  Input,
  Upload,
  message,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import * as React from 'react';
import { connect } from 'react-redux';

import {
  archiveTags,
  getDownloadUrl,
  getQiniuToken,
  updateProfile,
} from '@/apis';
import { IState } from '@/ducks';
import * as S from '@/schema';
import { PageHeader } from 'rtw-components/src';

import { userActions } from '../../ducks/profile';
import { ArchiveTag } from '../ArchiveData';

import * as styles from './index.less';

export interface UserProfileProps {
  profile: S.UserProfile;
  loadProfile: (id: number) => void;
}

export interface UserProfileState {
  editSig: boolean;
  isLoading: boolean;

  token?: string;
  signature?: string;
  avatarName?: string;
}

export class UserProfileComp extends React.Component<
  UserProfileProps,
  UserProfileState
> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      editSig: false,
      isLoading: false,
    };
  }

  async componentDidMount() {
    this.onRefresh();

    const resp = await archiveTags();
    console.log('resp', resp);
  }

  onRefresh = () => {
    this.props.loadProfile(1);
  };

  renderUserInfo() {
    const { profile } = this.props;

    if (!profile) {
      return;
    }

    const uploadButton = (
      <div>
        <Icon type={this.state.isLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'felx-start',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: 24, padding: '24px 0' }}>
          <Upload
            accept="image/*"
            listType="picture-card"
            showUploadList={false}
            onChange={this.onUploadChange}
            beforeUpload={this.beforeUpload}
            action="http://upload.qiniup.com"
            data={{ token: this.state.token }}
          >
            {!profile.avatarUrl ? (
              uploadButton
            ) : (
              <Avatar size={150} src={profile.avatarUrl} />
            )}
          </Upload>
        </div>
        <Descriptions
          column={1}
          style={{ width: 300, padding: '24px ' }}
          title={profile.username || '-'}
        >
          <Descriptions.Item>
            <Icon type="environment" style={{ marginRight: 8 }} />
            {profile.address}
          </Descriptions.Item>
          <Descriptions.Item>
            <Icon type="book" style={{ marginRight: 8 }} />
            {profile.university}
          </Descriptions.Item>
          <Descriptions.Item>
            <Icon type="mail" style={{ marginRight: 8 }} />
            {profile.email}
          </Descriptions.Item>
          <Descriptions.Item>
            <Icon type="github" style={{ marginRight: 8 }} />
            {profile.github}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  beforeUpload = async (file: RcFile): Promise<any> => {
    if (file.size / 1024 / 1024 > 10) {
      message.error('上传图片不得大于10M');
      return false;
    }
    const token = await getQiniuToken();
    this.setState({ token, avatarName: file.name });
  };

  onUploadChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      this.setState({ isLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ isLoading: false });
      const avatarUrl = await getDownloadUrl(info.file.response.key);
      await updateProfile({ avatarUrl });
      this.onRefresh();
      return;
    }
  };

  clickBtn = async (type: 'confirm' | 'cancel') => {
    if (type === 'cancel') {
      this.setState({ signature: '', editSig: false });
    } else {
      const { signature } = this.state;
      const resp = await updateProfile({ signature });
      if (resp) {
        await this.setState({ editSig: !resp });
        this.onRefresh();
      }
    }
  };

  renderSignature() {
    const { profile } = this.props;
    return (
      <div className={styles.signature}>
        <div className={styles.sigHeader}>
          <div>
            <Badge color="#ff5f57" />
            <Badge color="#ffbc2e" />
            <Badge color="#28ca42" />
          </div>
          <div
            className={styles.editSig}
            onClick={() => this.setState({ editSig: true })}
          >
            <Icon type="edit" style={{ marginRight: 4 }} />
            编辑
          </div>
        </div>
        <div className={styles.sigContent}>
          {!this.state.editSig ? (
            <span>
              {profile.signature ? profile.signature : '添加个性签名'}
            </span>
          ) : (
            <>
              <Input.TextArea
                style={{ maxHeight: 100 }}
                onChange={e => this.setState({ signature: e.target.value })}
                defaultValue={profile.signature ? profile.signature : ''}
              />
              <div className={styles.sigBtns}>
                <Button
                  style={{ fontSize: 12 }}
                  onClick={() => this.clickBtn('cancel')}
                  size="small"
                >
                  取消
                </Button>
                &nbsp;
                <Button
                  style={{ fontSize: 12 }}
                  onClick={() => this.clickBtn('confirm')}
                  size="small"
                >
                  确认
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <PageHeader
          title="个人中心"
          onBack={() => history.back()}
          style={{ backgroundColor: '#fff' }}
        />
        <div className={styles.userInfo}>
          {this.renderUserInfo()}
          {this.renderSignature()}
        </div>
        <div className={styles.content}>
          <ArchiveTag />
        </div>
      </div>
    );
  }
}

export const UserProfile = connect(
  (state: IState) => ({
    profile: state.user.profile.profile,
  }),
  {
    loadProfile: userActions.loadProfile,
  },
)(UserProfileComp);
