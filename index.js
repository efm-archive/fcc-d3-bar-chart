const svgWidth = '900';
const svgHeight = '600';
const chartWidth = '800';
const chartHeight = '500';

var bodySvg = d3
  .select('body')
  .append('svg')
  .attr('id', 'bodySvg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// var chartSvg = d3
//   .select('svg')
//   .append('svg')
//   .attr('id', 'bodySvg')
//   .attr('width', svgWidth)
//   .attr('height', svgHeight);

bodySvg
  .append('text')
  .attr('id', 'title')
  .attr('x', svgWidth / 2)
  .attr('y', 0 + 18)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('FCC D3 Data Visualization Projects - Visualize Data with a Bar Chart');

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(json => {
    const { data } = json;
    const barWidth = Math.floor(svgWidth / data.length);

    // console.log('data :', data);
    const scaleX = d3
      .scaleLinear()
      .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
      .range([0, svgWidth]);
    const scaleY = d3
      .scaleLinear()
      .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
      .range([svgHeight, 0]);

    const axisX = d3.axisBottom().scale(scaleX);
    const axisY = d3.axisLeft().scale(scaleY);

    bodySvg
      .append('g')
      .call(axisX)
      .attr('id', 'x-axis');
    bodySvg
      .append('g')
      .call(axisY)
      .attr('id', 'y-axis');

    const bar = d3
      .select('svg')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', barWidth - 1)
      .attr('y', d => scaleY(d[1]))
      .attr('height', d => {
        // console.log('d[1] :', d[1]);
        return svgHeight - scaleY(d[1]);
      })
      .attr('transform', (d, i) => {
        return 'translate(' + i * barWidth + ')';
      });
  })
  .catch(err => {
    console.error(err);
  });
