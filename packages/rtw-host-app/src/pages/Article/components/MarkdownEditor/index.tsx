import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import MarkDownIt from 'markdown-it';
import toc from 'markdown-it-table-of-contents';
import * as React from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import UploadPic from './plugins/Upload';

interface MarkdownEditorProps {
  mdValue?: string;

  onChange?: (type: 'mdValue' | 'title') => void;
}

interface MarkdownEditorState {
  mdValue?: string;
}

MdEditor.use(UploadPic);

const plugins = [
  'header',
  'fonts',
  'table',
  'my-plugins',
  'link',
  'clear',
  'logger',
  'mode-toggle',
  'full-screen',
  'upload',
];
const mdParser: MarkDownIt = new MarkDownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },
}).use(toc);

export class MarkdownEditor extends React.Component<
  MarkdownEditorProps,
  MarkdownEditorState
> {
  constructor(props: MarkdownEditorProps) {
    super(props);

    this.state = {
      mdValue: '## 九山八海为一世界',
    };
  }

  renderHTML = (mdValue: string) => {
    const htmlValue = mdParser.render(mdValue);

    return htmlValue;
  };

  public render(): JSX.Element {
    const { mdValue, onChange } = this.props;
    return (
      <MdEditor
        value={mdValue}
        plugins={plugins}
        style={{ height: 460 }}
        renderHTML={this.renderHTML}
        onChange={onChange('mdValue') as any}
        config={{ imageUrl: 'https://octodex.github.com/images/minion.png' }}
      />
    );
  }
}
