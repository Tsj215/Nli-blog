import { Button, Icon, Upload } from 'antd';
import Braft, { BuiltInControlType, ExtendControlType } from 'braft-editor';
import 'braft-editor/dist/index.css';
import * as React from 'react';

interface BraftEditorProps {
  editorState: any;
  onChange: (type: 'editorState' | 'title') => void;
}

interface BraftEditorState {}

export class BraftEditor extends React.Component<
  BraftEditorProps,
  BraftEditorState
> {
  constructor(props: BraftEditorProps) {
    super(props);

    this.state = {};
  }

  buildPreviewHtml() {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.props.editorState.toHTML()}</div>
        </body>
      </html>
    `;
  }

  public render(): JSX.Element {
    const { editorState, onChange } = this.props;
    const excludeControls: BuiltInControlType[] = [
      'media',
      'subscript',
      'superscript',
      'letter-spacing',
    ];
    const extendControls: ExtendControlType[] = [
      {
        key: 'custom-modal',
        type: 'modal',
        html: null,
        text: '预览',
        modal: {
          id: 'my-modal',
          title: '预览内容',
          width: 500,
          height: 700,
          showFooter: false,
          showConfirm: false,
          showCancel: false,
          children: (
            <div
              dangerouslySetInnerHTML={{ __html: this.buildPreviewHtml() }}
            />
          ),
        },
      },
      {
        key: 'upload',
        type: 'component',
        component: (
          <Upload accept="image/*" showUploadList={false}>
            <Button className="control-item button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </Button>
          </Upload>
        ),
      },
    ];

    return (
      <Braft
        value={editorState}
        extendControls={extendControls}
        excludeControls={excludeControls}
        style={{ backgroundColor: '#fff' }}
        onChange={onChange('editorState') as any}
      />
    );
  }
}
