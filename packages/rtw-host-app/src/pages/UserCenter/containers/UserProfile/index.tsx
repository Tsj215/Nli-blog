import { Avatar, Badge, Button, Descriptions, Icon, Input } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';

import { updateProfile } from '@/apis';
import { IState } from '@/ducks';
import * as S from '@/schema';
import { PageHeader } from 'rtw-components/src';

import { userActions } from '../../ducks/profile';

import * as styles from './index.less';

export interface UserProfileProps {
  profile: S.UserProfile;
  loadProfile: (id: number) => void;
}

export interface UserProfileState {
  editSig: boolean;
  signature?: string;
}

export class UserProfileComp extends React.Component<
  UserProfileProps,
  UserProfileState
> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      editSig: false,
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.loadProfile(1);
  };

  renderUserInfo() {
    const { profile } = this.props;

    console.log(profile);

    if (!profile) {
      return;
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'felx-start',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: 24, padding: '24px 0' }}>
          <Avatar size={150} src="https://picsum.photos/150/150" />
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
          <Button>点击</Button>
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
