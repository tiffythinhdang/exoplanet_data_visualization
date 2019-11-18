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
    // xAxisLabel,
    // yValue,
    // yAxisLabel,
    numBins,
    margin,
    histogramWidth,
    histogramHeight,
    data
  } = props;

  const innerHeight = histogramHeight - margin.top - margin.bottom;
  const innerWidth = histogramWidth - margin.left - margin.right;

  // Initialize a container of the graph 
  const g = selection.selectAll('.xhistogram-container').data([null]);
  const gEnter = g
    .enter().append('g')
    .attr('class', 'xhistogram-container')
  gEnter
    .merge(g)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  // Map data x-range to graph range
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  // Set x-axis
  const axisTickFormat = (number) =>
    format('~s')(number);

  const xAxis = axisBottom(xScale)
    .tickFormat(axisTickFormat)
    .tickPadding(15);

  const xAxisGroup = g.select('.xhistogram-x-axis');
  const xAxisGroupEnter = gEnter
    .append('g')
    .attr('class', 'xhistogram-x-axis');
  xAxisGroup
    .merge(xAxisGroupEnter)
    .call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`) //move the axis to the bottom


  // Set the parameters for the histogram
  const histogramG = histogram()
    .value(xValue)   // I need to give the vector of value
    .domain(xScale.domain())  // then the domain of the graphic
    .thresholds(xScale.ticks(numBins)); // then the numbers of bins


  // And apply this function to data to get the bins
  const bins = histogramG(data);


  // Map data y-range to graph range
  const yScale = scaleLinear()
    .domain([0, max(bins, (d) => d.length)])
    .range([innerHeight, 0]);

  selection.append("g")
    .call(axisLeft(yScale));

  // append the bar rectangles to the svg element
  selection.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", (d) => {
      // debugger
      return `translate(${xScale(d.x0)}, ${yScale(d.length)})`
    })
    .attr("width", (d) => {
      // debugger
      return xScale(d.x1) - xScale(d.x0) - 1
    })
    .attr("height", (d) => {
      // debugger
      return innerHeight - yScale(d.length)
    })
};
