import {
  Button,
  Col,
  DatePicker,
  Icon,
  Input,
  Popconfirm,
  Row,
  Tabs,
  Timeline,
  message,
} from 'antd';
import { Moment } from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';

import { addMoCloudMsg, deleteMoCloudMsg } from '@/apis';
import Cloud from '@/assets/cloud.svg';
import { IState } from '@/ducks';
import { moCloudActions } from '@/pages/MoCloud/ducks/moCloud';
import * as S from '@/schema';

import * as styles from './index.less';

export interface MessageBoardProps {
  moCloudMsg: S.MoCloudMsg[];
  loadMoCloudMsg: () => void;
}

const { TabPane } = Tabs;

const color = ['red', '#8C8DFF', '#178fff', '#13c2c2'];

export interface MessageBoardState {
  isLoading: boolean;
  inputValue: string;
  dateValue: string;
  // 此处 number 当做 string 用
  [key: number]: boolean;
}

export class MessageBoardComp extends React.Component<
  MessageBoardProps,
  MessageBoardState
> {
  constructor(props: MessageBoardProps) {
    super(props);

    this.state = {
      isLoading: false,
      inputValue: '',
      dateValue: '',
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.loadMoCloudMsg();
  };

  renderTimeLine = () => {
    const { moCloudMsg } = this.props;

    return (
      <Tabs defaultActiveKey="1" size="small" style={{ width: 490 }}>
        <TabPane tab="晚安" key="1">
          <div className={styles.autoLine}>
            <Timeline mode="alternate" reverse={true}>
              {moCloudMsg.length > 0 &&
                moCloudMsg.map((m, index) => this.renderTimeLineItem(m, index))}
            </Timeline>
          </div>
        </TabPane>
        <TabPane tab="知识点" key="2">
          知识点啊
        </TabPane>
      </Tabs>
    );
  };

  renderTimeLineItem = (m: S.MoCloudMsg, index: number) => {
    const content = (
      <>
        <span>{m.message}</span>
        <p>{S.formatDatetime(m.createAt)}</p>
      </>
    );

    const actions = (
      <Popconfirm
        title="确定删除吗"
        onConfirm={async () => {
          const resp = await deleteMoCloudMsg(m.id);
          if (resp) {
            message.success('删除成功');
            this.onRefresh();
          }
        }}
      >
        <Icon
          type="delete"
          onClick={e => {
            e.preventDefault();
            console.log(m);
          }}
          style={{
            cursor: 'pointer',
            transition: 'color .6s',
            color: !this.state[m.id] && '#fff',
          }}
        />
      </Popconfirm>
    );

    const dot = (
      <Icon type="heart" theme="filled" style={{ color: '#8C8DFF' }} />
    );

    return (
      <Timeline.Item
        key={m.id}
        dot={index == 0 && dot}
        style={{ marginTop: 12 }}
        color={color[Math.round(Math.random() * 4)]}
      >
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          onMouseEnter={() => this.setState({ [m.id as any]: true })}
          onMouseLeave={() => this.setState({ [m.id as any]: false })}
        >
          <Col span={20}>{content}</Col>
          <Col span={2}>{actions}</Col>
        </Row>
      </Timeline.Item>
    );
  };

  newMessage = () => {
    const { inputValue, isLoading } = this.state;

    return (
      <div className={styles.addMsg}>
        <Input
          value={inputValue}
          addonBefore={<Icon type="cloud" />}
          style={{ width: 332, marginBottom: 12 }}
          onChange={this.onInputChange}
        />
        <div
          style={{
            display: 'flex',
            width: 332,
            justifyContent: 'space-between',
          }}
        >
          <DatePicker
            showTime={true}
            style={{ width: 250 }}
            onChange={this.onDateChange}
          />
          <Button
            loading={isLoading}
            onClick={async () => {
              const { inputValue, dateValue } = this.state;
              if (inputValue && dateValue) {
                this.setState({ isLoading: true });
                const resp = await addMoCloudMsg(inputValue, dateValue);
                if (resp) {
                  this.setState({
                    inputValue: '',
                    dateValue: '',
                    isLoading: false,
                  });
                  message.success('添加成功');
                  this.onRefresh();
                }
              } else {
                this.setState({ isLoading: false });
                message.error('请输入内容并选择时间');
              }
            }}
          >
            确定
          </Button>
        </div>
      </div>
    );
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  onDateChange = (_: Moment, dateValue: string) => {
    this.setState({ dateValue });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.timeLine}>
          <Cloud />
          {this.renderTimeLine()}
        </div>
        {this.newMessage()}
      </div>
    );
  }
}

export const MessageBoard = connect(
  (state: IState) => ({
    moCloudMsg: state.moCloud.moCloudMsg.moCloudMsg,
  }),
  {
    loadMoCloudMsg: moCloudActions.loadMoCloudMsg,
  },
)(MessageBoardComp as any);
