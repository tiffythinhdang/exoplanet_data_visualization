import {
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  max,
  format,
  histogram
} from 'd3';

export const histogramGraph = (selection, props) => {
  const {
    title,
    xValue,
    numBins,
    margin,
    histogramWidth,
    histogramHeight,
    data
  } = props;

  const innerHeight = histogramHeight - margin.top - margin.bottom;
  const innerWidth = histogramWidth - margin.left - margin.right;

  // Initialize a container of the graph
  const g = selection.selectAll('.histogram-container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'histogram-container');

  gEnter
    .merge(g)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);


  // Map data x-range to graph range
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  // Set x-axis
  const axisTickFormat = (number) => format('~s')(number);

  const xAxis = axisBottom(xScale)
    .ticks(10)
    .tickFormat(axisTickFormat)
    .tickPadding(5);

  const xAxisGroup = g.select('.histogram-x-axis');
  const xAxisGroupEnter = gEnter
    .append('g')
      .attr('class', 'histogram-x-axis');

  xAxisGroup
    .merge(xAxisGroupEnter)
      .call(xAxis)
      .attr('transform', `translate(0, ${innerHeight})`); //move the axis to the bottom


  // Set the parameters for the histogram
  const histogramG = histogram()
    .value(xValue)
    .domain(xScale.domain())
    .thresholds(xScale.ticks(numBins));

  // Apply this function to data to get the bins
  const bins = histogramG(data);

  // Map data y-range to graph range
  const yScale = scaleLinear()
    .domain([0, max(bins, (d) => d.length)])
    .range([innerHeight, 0])
    .nice();

  // Set y-axis
  const yAxis = axisLeft(yScale)
    .ticks(5)
    .tickFormat(axisTickFormat)
    .tickPadding(5);

  const yAxisGroup = g.select('.histogram-y-axis');
  const yAxisGroupEnter = gEnter
    .append('g')
      .attr('class', 'histogram-y-axis');

  yAxisGroup
    .merge(yAxisGroupEnter)
      .call(yAxis);

  // Render the bars
  selection.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
      .attr("x", 1)
      .attr("transform", (d) =>
        `translate(
          ${xScale(d.x0) + margin.left}, ${yScale(d.length) + margin.top}
        )`
      )
      .attr("width", (d) => xScale(d.x1) - xScale(d.x0) - 1)
      .attr("height", (d) => innerHeight - yScale(d.length));

  // Render graph label
  const titleGroup = g.select('.histogram-label');
  const titleGroupEnter = gEnter
    .append('g')
      .attr('class', 'histogram-label');

  titleGroup
    .merge(titleGroupEnter);

  const graphTitle = titleGroupEnter
    .append('text')
      .attr("class", "histogram-label")
      .attr('y', -15)
    .merge(titleGroup.select(".histogram-label"))
      .text(title);
};
