import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import _ from 'lodash';
import MarkDownIt from 'markdown-it';
import * as React from 'react';
import 'react-markdown-editor-lite/lib/index.css';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { getArticleById } from '@/apis';
import { IState } from '@/ducks';
import * as S from '@/schema';

import * as styles from './index.less';

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
});

export interface ArticleDetailProps
  extends RouteComponentProps<{ articleId: string }> {}

export interface ArticleDetailState {
  article: S.Article;
}

class ArticleDetailCom extends React.Component<
  ArticleDetailProps,
  ArticleDetailState
> {
  get articleId() {
    return this.props.match.params.articleId;
  }

  constructor(props: ArticleDetailProps) {
    super(props);

    this.state = {
      article: new S.Article(),
    };
  }

  async componentDidMount() {
    const article = await getArticleById(_.toNumber(this.articleId));

    this.setState({ article });
  }

  render() {
    const { article } = this.state;

    return (
      <div className={styles.container}>
        <div
          className="custom-html-style html-wrap"
          dangerouslySetInnerHTML={{
            __html: mdParser.render(_.get(article, 'content', '')),
          }}
        />
      </div>
    );
  }
}

export const ArticleDetail = connect(
  (_state: IState) => ({}),
  {},
)(ArticleDetailCom);
