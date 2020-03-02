import MarkDownIt from 'markdown-it';
import * as React from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface MarkdownEditorProps {
  mdValue?: string;

  onChange?: (type: 'mdValue' | 'title') => void;
}

interface MarkdownEditorState {
  mdValue?: string;
}

const mdParser = new MarkDownIt();

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
    return mdParser.render(mdValue);
  };

  public render(): JSX.Element {
    const { mdValue, onChange } = this.props;
    return (
      <MdEditor
        value={mdValue}
        style={{ height: 460 }}
        renderHTML={this.renderHTML}
        onChange={onChange('mdValue') as any}
      />
    );
  }
}
