import { 
  select, 
  csv, 
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  // format => if needed to format x-axis value
} from 'd3';
import { numericColNames } from './numeric_cols';
import { dropdownMenu } from './dropdown_menu';
import { scatterPlot } from './scatter_plot';

// Get the graph area
const svg = select('#graph');

// Parse width and height of the graph area to number
const width = +svg.attr("width");
const height = +svg.attr("height");

// Initialize data
let data;
let xColName;
let yColName;

//Helper function for choosing drop down
const onXColumnClicked = column => {
  xColName = column;
  render();
};

const onYColumnClicked = column => {
  yColName = column;
  render();
};

const render = () => {
  select('#x-menu')
    .call(dropdownMenu, {
      options: numericColNames,
      onOptionClicked: onXColumnClicked,
      // selectedOption: xColumn
    });

  select('#y-menu')
    .call(dropdownMenu, {
      options: numericColNames,
      onOptionClicked: onYColumnClicked,
      // selectedOption: yColumn
    });

  svg.call(scatterPlot, {
    title: `${ xColName } vs ${ yColName }`,
    xValue: (d) => d[xColName],
    xAxisLabel: xColName,
    yValue: (d) => d[yColName],
    yAxisLabel: yColName,
    circleRadius: 10,
    margin: { top: 75, right: 50, bottom: 100, left: 200 },
    width,
    height,
    data
  })
};

// Read data and change values of numeric columns from string to number
csv('../data/phl_hec_all_confirmed.csv').then(loadedData => {
  data = loadedData;
  data.forEach((d) => {
    numericColNames.forEach(col => {
      d[col] = +d[col];
    })     
  })
  xColName = numericColNames[5];
  yColName = numericColNames[4];
  render();
});
