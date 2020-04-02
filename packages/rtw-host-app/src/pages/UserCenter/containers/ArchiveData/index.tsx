import { Chart, Coord, Geom, Label, Legend, Tooltip } from 'bizcharts';
import * as React from 'react';

import { archiveTags } from '@/apis';
import * as S from '@/schema';

interface ArchiveTagProps {}

interface ArchiveTagState {
  archiveData: S.ArchiveTag[];
}

export class ArchiveTag extends React.Component<
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
    const archiveData = await archiveTags();
    this.setState({ archiveData });
  }

  public render(): JSX.Element {
    return (
      <div>
        <Chart
          height={400}
          forceFit={true}
          style={{ width: 500 }}
          padding={[20, 40, 0, -40]}
          data={this.state.archiveData.map(a => ({
            标签: a.content,
            文章: a.articles.length,
          }))}
        >
          <Coord type="polar" innerRadius={0.1} />
          <Tooltip />
          <Legend position="right" offsetX={-30} />
          <Geom
            type="interval"
            color={['标签', '#1FA2FF-#A6FFCB']}
            position="标签*文章"
            style={{
              // stylelint-disable-next-line property-no-unknown
              lineWidth: 2,
              stroke: '#fff',
            }}
          >
            <Label content="标签" offset={-15} />
          </Geom>
        </Chart>
      </div>
    );
  }
}
