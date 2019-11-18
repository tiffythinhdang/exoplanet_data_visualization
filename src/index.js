import { select, csv } from 'd3';
import { numericColNames } from './numeric_cols';
import { dropdownMenu } from './dropdown_menu';
import { scatterPlot } from './scatter_plot';
import { histogramGraph } from './histogram';

// Get the all the graphs
const graph = select('#scatter-plot-graph');
const histogramX = select('#histogram-graph-x');
const histogramY = select('#histogram-graph-y');

// Parse width and height of the graph areas to number
const width = +graph.attr("width");
const height = +graph.attr("height");
const histogramWidth = +histogramX.attr("width");
const histogramHeight = +histogramX.attr("height");

// Initialize data and col
let data;
let xColName;
let yColName;

// Callback function for choosing drop down
const onXColumnClicked = (column) => {
  xColName = column;
  render();
};

const onYColumnClicked = (column) => {
  yColName = column;
  render();
};

const render = () => {
  // Select and render drop-down menu
  select('#x-menu')
    .call(dropdownMenu, {
      options: numericColNames,
      onOptionClicked: onXColumnClicked,
      selectedOption: xColName
    });

  select('#y-menu')
    .call(dropdownMenu, {
      options: numericColNames,
      onOptionClicked: onYColumnClicked,
      selectedOption: yColName
    });

  // Render scatter plot
  graph.call(scatterPlot, {
    title: `${ xColName } vs ${ yColName }`,
    xValue: (d) => d[xColName],
    xAxisLabel: xColName,
    yValue: (d) => d[yColName],
    yAxisLabel: yColName,
    circleRadius: 8,
    margin: { top: 75, right: 100, bottom: 100, left: 100 },
    width,
    height,
    data
  });

  // Render histograms
  histogramX.call(histogramGraph, {
    title: `${xColName} Histogram`,
    xValue: (d) => d[xColName],
    numBins: 10,
    margin: { top: 25, right: 20, bottom: 20, left: 50 },
    histogramWidth,
    histogramHeight,
    data
  });

  histogramY.call(histogramGraph, {
    title: `${yColName} Histogram`,
    xValue: (d) => d[yColName],
    numBins: 10,
    margin: { top: 25, right: 20, bottom: 20, left: 50 },
    histogramWidth,
    histogramHeight,
    data
  });
};

// Read data, change values of numeric columns from string to number, and render
csv('../data/phl_hec_all_confirmed.csv').then(loadedData => {
  data = loadedData;
  data.forEach((d) => {
    numericColNames.forEach(col => {
      d[col] = +d[col];
    })
  });

  xColName = numericColNames[4];
  yColName = numericColNames[25];
  render();
});
