// Margin Convention as per https://bl.ocks.org/mbostock/3019563

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const bodySvg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

bodySvg
  .append('text')
  .attr('id', 'title')
  .attr('x', width / 2)
  .attr('y', 20)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .style('font-family', 'sans-serif')
  .text('FCC D3 Data Visualization Projects - Visualize Data with a Bar Chart');

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(json => {
    const { data } = json;
    const barWidth = width / data.length;
    const begin = new Date(data[0][0]);
    const end = new Date(data[data.length - 1][0]);

    const scaleX = d3
      .scaleTime()
      .domain([begin, end])
      .range([0, width]);
    const scaleY = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => {
          return 0;
        }),
        d3.max(data, d => {
          return d[1];
        })
      ])
      .range([height, 0]);

    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY);

    bodySvg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisX);

    bodySvg
      .append('g')
      .attr('id', 'y-axis')
      .call(axisY);

    const tooltipDiv = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    const bar = d3
      .select('svg')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => {
        return d[0];
      })
      .attr('data-gdp', d => {
        return d[1];
      })
      .attr('width', barWidth - 1)
      .attr('x', d => margin.left)
      .attr('y', d => scaleY(d[1]) + margin.top)
      .attr('height', d => {
        return height - scaleY(d[1]);
      })
      .attr('transform', (d, i) => {
        return 'translate(' + i * barWidth + ')';
      })
      .on('mouseover', d => {
        // console.log('d :', d);
        // console.log('d3.event :', d3.event);
        // console.log('d3.event.pageX :', d3.event.pageX);
        // console.log('d3.event.pageY :', d3.event.pageY);
        tooltipDiv
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .style('font-size', '14px')
          .style('font-family', 'sans-serif')
          .attr('data-date', d[0])
          .html('Date:<br/>' + d[0]);
        tooltipDiv
          .transition()
          .duration(50)
          .style('opacity', 0.8);
      })
      .on('mouseout', d => {
        tooltipDiv
          .transition()
          .duration(600)
          .style('opacity', 0);
      });
  })
  .catch(err => {
    console.error(err);
  });
