import { Icon, Tag } from 'antd';
import _ from 'lodash';
import * as React from 'react';

import * as S from '@/schema';

const { CheckableTag } = Tag;

type handletype = 'filter' | 'select' | 'show';

interface HandleTagProps {
  value: S.Tag;
  // 外层组件传入的标签列表
  tagList: S.Tag[];
  // 是否选中由上层组件控制
  checked: boolean;
  handletype: handletype;

  // 选择标签时触发
  selectTags: (tag: S.Tag) => void;
  // 关闭标签时触发
  deleteTags: (tagId: number) => void;
  onChange: (checked: boolean, value: S.Tag) => Promise<void>;
}

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1261840_lnfedak82x.js'
});

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
        <CheckableTag checked={checked} onChange={checked => onChange(checked, value)}>
          <IconFont
            type={
              checked ? `icon-${_.toLower(value.content)}-copy` : `icon-${_.toLower(value.content)}`
            }
            style={{ marginRight: 8 }}
          />
          {value.content}
        </CheckableTag>
      );
    } else if (handletype === 'select') {
      const { tagList } = this.props;
      return (tagList || []).map(t => (
        <Tag
          key={t.id}
          defaultValue={t.id}
          color="#6874e2"
          style={{ cursor: 'pointer', marginBottom: 6 }}
          onClick={() => selectTags(t)}
        >
          {t.content}
        </Tag>
      ));
    } else {
      const { tagList, deleteTags } = this.props;
      return (tagList || []).map(t => (
        <Tag key={t.id} closable={true} onClose={() => deleteTags(t.id)}>
          {t.content}
        </Tag>
      ));
    }
  }
}
