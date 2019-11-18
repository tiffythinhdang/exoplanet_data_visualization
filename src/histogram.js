import {
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  max,
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

  // X axis: scale and draw:
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  selection.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(axisBottom(xScale));

  // set the parameters for the histogram
  const histogramG = histogram()
    .value(xValue)   // I need to give the vector of value
    .domain(xScale.domain())  // then the domain of the graphic
    .thresholds(xScale.ticks(numBins)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = histogramG(data);


  // Y axis: scale and draw:
  const yScale = scaleLinear()
    .range([innerHeight, 0]);

  yScale.domain( [0, max(bins, (d) => d.length)] );

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
