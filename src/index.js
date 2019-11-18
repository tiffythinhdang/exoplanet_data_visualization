import { 
  select, 
  csv
} from 'd3';
import { numericColNames } from './numeric_cols';
import { dropdownMenu } from './dropdown_menu';
import { scatterPlot } from './scatter_plot';

// Get the graph area
const graph = select('#scatter-plot-graph');

// Parse width and height of the graph area to number
const width = +graph.attr("width");
const height = +graph.attr("height");

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
  // debugger
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
  })
};

// Read data, change values of numeric columns from string to number, and render
csv('../data/phl_hec_all_confirmed.csv').then(loadedData => {
  data = loadedData;
  data.forEach((d) => {
    numericColNames.forEach(col => {
      d[col] = +d[col];
    })     
  })
  xColName = numericColNames[4];
  yColName = numericColNames[31];
  render();
});
