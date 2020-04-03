import { Axis, Chart, Coord, Geom, Label, Legend, Tooltip } from 'bizcharts';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { archiveTags } from '@/apis';
import { IState } from '@/ducks';
import { articleActions } from '@/pages/article/ducks/blog';
import * as S from '@/schema';

import * as styles from './index.less';

interface ArchiveTagProps {
  showInBars: boolean;
  countArticle: S.CountArticle[];

  loadArticleCntByCreateAt: () => void;
}

interface ArchiveTagState {
  archiveData: S.ArchiveTag[];
}

export class ArchiveDataCom extends React.Component<
  ArchiveTagProps,
  ArchiveTagState
> {
  constructor(props: ArchiveTagProps) {
    super(props);
    this.state = {
      archiveData: [],
    };
  }

  async componentDidMount() {
    this.props.loadArticleCntByCreateAt();
    const archiveData = await archiveTags();
    this.setState({ archiveData });
  }

  public render(): JSX.Element {
    const { countArticle, showInBars } = this.props;
    return (
      <div className={styles.container}>
        <Chart
          height={showInBars ? 400 : 340}
          forceFit={true}
          style={
            showInBars
              ? { width: 500 }
              : {
                  width: 260,
                  marginTop: 12,
                  borderRadius: 4,
                  backgroundColor: '#fff',
                }
          }
          padding={showInBars ? [20, 40, 0, -40] : [-95, 0, 0, 12]}
          data={this.state.archiveData.map(a => ({
            标签: a.content,
            文章: a.articles.length,
          }))}
        >
          <Coord type="polar" innerRadius={0.1} />
          <Tooltip />
          {showInBars ? (
            <Legend position="right" offsetX={-30} />
          ) : (
            <Legend position="bottom" offsetY={-90} />
          )}
          <Geom
            type="interval"
            color={['标签', '#1FA2FF-#A6FFCB']}
            position="标签*文章"
            style={{
              // stylelint-disable-next-line property-no-unknown
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label content="标签" offset={-15} />
          </Geom>
        </Chart>
        {showInBars && (
          <Chart
            height={400}
            style={{ width: 600 }}
            data={(countArticle || []).map(c => ({
              数量: _.toNumber(c.count),
              日期: c.date,
            }))}
            forceFit={true}
            scale={{ 数量: { tickInterval: 1 } }}
            padding={[30, 70, 30, 50]}
          >
            <Axis name="日期" title={true} />
            <Axis name="数量" title={true} />
            <Legend position="right" />
            <Tooltip />
            <Geom
              size={35}
              type="interval"
              position="日期*数量"
              tooltip={[
                '日期*数量',
                (日期, 数量) => ({ name: 日期, value: `${数量} 篇文章` }),
              ]}
              color={['数量', '#1FA2FF-#A6FFCB']}
            >
              <Label content="数量" />
            </Geom>
          </Chart>
        )}
      </div>
    );
  }
}

export const ArchiveData = connect(
  (state: IState) => ({
    countArticle: state.blog.article.countArticle,
  }),
  { loadArticleCntByCreateAt: articleActions.loadArticleCntByCreateAt },
)(ArchiveDataCom);
