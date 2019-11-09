// Margin Convention as per https://bl.ocks.org/mbostock/3019563

var margin = { top: 50, right: 50, bottom: 50, left: 50 };

// Then define width and height as the inner dimensions of the chart area.

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// Lastly, define svg as a G element that translates the origin to the top-left corner of the chart area.

var bodySvg = d3
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
  .attr('y', 0 + 18)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .style('font-family', 'sans-serif')
  .text('FCC D3 Data Visualization Projects - Visualize Data with a Bar Chart');

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(json => {
    const { data } = json;
    // const barWidth = Math.floor(width / data.length);
    const barWidth = width / data.length;

    console.log('data :', data);

    var begin = new Date(data[0][0]);
    var end = new Date(data[data.length - 1][0]);
    // console.log('begin :', begin, 'end :', end);

    const scaleX = d3
      .scaleTime()
      .domain([begin, end])
      .range([0, width]);
    const scaleY = d3
      .scaleLinear()
      .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
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

    const bar = d3
      .select('svg')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', barWidth - 1)
      .attr('x', d => margin.left)
      .attr('y', d => scaleY(d[1]) + margin.top)
      .attr('height', d => {
        // console.log('d[1] :', d[1]);
        return height - scaleY(d[1]);
      })
      .attr('transform', (d, i) => {
        return 'translate(' + i * barWidth + ')';
      });
  })
  .catch(err => {
    console.error(err);
  });
