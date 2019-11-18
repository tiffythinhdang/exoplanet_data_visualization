import {
  scaleLinear,
  format,
  extent,
  axisLeft,
  axisBottom
} from 'd3';

export const scatterPlot = (selection, props) => {
  const {
    title,
    xValue,
    xAxisLabel,
    yValue,
    yAxisLabel,
    circleRadius,
    margin,
    width,
    height,
    data
  } = props;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  
  // Map data x-range to graph range
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();


  // Map data y-range to graph range
  const yScale = scaleLinear()
    .domain(extent(data, xValue).reverse())
    .range([0, innerHeight])
    .nice();


  // Initialize a container of the graph 
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container')
  gEnter
    .merge(g)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);


  // Set x-axis and y-axis
  const axisTickFormat = (number) =>
    format('~s')(number);

  const xAxis = axisBottom(xScale)
    .tickFormat(axisTickFormat)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = axisLeft(yScale)
    .tickFormat(axisTickFormat)
    .tickSize(-innerWidth)
    .tickPadding(15);


  const xAxisGroup = g.select('.x-axis');
  const xAxisGroupEnter = gEnter
    .append('g')
    .attr('class', 'x-axis');
  xAxisGroup
    .merge(xAxisGroupEnter)
    .call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`) //move the axis to the bottom
    .selectAll('.domain').remove();
  
  const yAxisGroup = g.select('.y-axis');
  const yAxisGroupEnter = gEnter
    .append('g')
      .attr('class', 'y-axis')
  yAxisGroup
    .merge(yAxisGroupEnter)
      .call(yAxis)
      .selectAll('.domain').remove();


  // Set x-axis and y-axis labels
  const xAxisLabelText = xAxisGroupEnter
    .append('text')
      .attr("class", "axis-label")
      .attr('y', 65)
    .merge(xAxisGroup.select(".axis-label"))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);
    
  const yAxisLabelText = yAxisGroupEnter
    .append('text')
      .attr("class", "axis-label")
      .attr('y', -65)
      .attr('transform', "rotate(-90)")
      .attr('text-anchor', 'middle')
    .merge(yAxisGroup.select(".axis-label"))
      .attr('x', -innerHeight / 2)
      .text(yAxisLabel);


  // Render scattered dots
  const circles = g.merge(gEnter)
    .selectAll('circle').data(data);
  circles
    .enter().append('circle')
      .attr('cx', innerWidth / 2)
      .attr('cy', innerHeight / 2)
      .attr('r', 0)
    .merge(circles)
    .transition().duration(2000)
    .delay((d, i) => i)
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius);


  // Render graph label
  const titleGroup = g.select('.graph-label');
  const titleGroupEnter = gEnter
    .append('g')
    .attr('class', 'graph-label');

  titleGroup
    .merge(titleGroupEnter);

  const graphTitle = titleGroupEnter
    .append('text')
      .attr("class", "graph-label")
      .attr('y', -30)
    .merge(titleGroup.select(".graph-label"))
      .text(title);
};
