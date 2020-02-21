import { Tag } from 'antd';
import * as React from 'react';

const { CheckableTag } = Tag;

type handletype = 'filter' | 'select' | 'show';

interface HandleTagProps {
  value: string;
  // 外层组件传入的标签列表
  tagList: string[];
  // 是否选中由上层组件控制
  checked: boolean;
  handletype: handletype;

  // 选择标签时触发
  selectTags: (tag: string) => void;
  // 关闭标签时触发
  deleteTags: (tag: string) => void;
  onChange: (checked: boolean, value: string) => void;
}

interface HandleTagState {}

export class HandleTags extends React.Component<Partial<HandleTagProps>, HandleTagState> {
  constructor(props: HandleTagProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { handletype, selectTags, value, onChange, checked } = this.props;

    if (handletype === 'filter') {
      return (
        <CheckableTag
          {...this.props}
          style={{ marginRight: 18 }}
          checked={checked}
          onChange={checked => onChange(checked, value)}
        />
      );
    } else if (handletype === 'select') {
      const { tagList } = this.props;
      return (tagList || []).map(t => (
        <Tag
          key={t}
          color="#13C2C2"
          style={{ cursor: 'pointer', marginBottom: 6 }}
          onClick={(e: any) => selectTags(e.target.innerText)}
        >
          {t}
        </Tag>
      ));
    } else {
      const { tagList, deleteTags } = this.props;
      return (tagList || []).map(t => (
        <Tag key={t} closable={true} onClose={() => deleteTags(t)}>
          {t}
        </Tag>
      ));
    }
  }
}
