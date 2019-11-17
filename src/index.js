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

// Get the graph area
const svg = select('#graph');

// Parse width and height of the graph area to number
const width = +svg.attr("width");
const height = +svg.attr("height");


const render = (data) => {
  // Initialize x-value and y-value. Use this to change col associated with each axis
  const xColName = numericColNames[45];
  // const yColName = "P. Name";
  const yColName = numericColNames[40];
  const xValue = (d) => d[xColName];
  const yValue = (d) => d[yColName];

  // Set margin for the graph:
  const margin = { top: 75, right: 50, bottom: 100, left: 200}
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  // Map data x-range to graph range
  const xScale = scaleLinear()
    .domain( extent(data, xValue) ) 
    .range([0, innerWidth])
    .nice();

  // Map data y-range to graph range
  const yScale = scaleLinear()
    .domain( extent(data, yValue) ) 
    .range([0, innerHeight])
    .nice();

  // Initialze a group to append the graph 
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Set up x-axis and y-axis
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(15);

  const xAxisGroup = g.append('g').call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`); //move the axis to the bottom
  const yAxisGroup = g.append('g').call(yAxis);

  // Set axis label
  xAxisGroup.append('text')
    .text(`${xColName}`)
    .attr("class", "axis label")
    .attr('y', 50)
    .attr('x', innerWidth / 2);

  yAxisGroup.append('text')
    .text(`${yColName}`)
    .attr("class", "axis label")
    .attr('y', -50)
    .attr('x', -innerHeight / 2)
    .attr('transform', "rotate(-90)")
    .attr('text-anchor', 'middle');

  // Render dots
  g.selectAll('circle').data(data)
    .enter().append('circle')
      .attr('cy', d => yScale( yValue(d) ))
      .attr('cx', d => xScale( xValue(d) ))
      .attr('r', 5);

  // Render title of graph
  g.append('text')
    .text(`${xColName} vs ${yColName}`)
    .attr("class", "graph title")
    .attr('y', -50);
};

// Read data and change values of numeric columns from string to number
csv('../data/phl_hec_all_confirmed.csv').then(data => {
  data.forEach((d) => {
    numericColNames.forEach(col => {
      d[col] = +d[col];
    })     
  })
  render(data);
});

// const render = () => {
//   select('#x-menu')
//     .call(dropdownMenu, {
//       options: numericColNames,
//       // onOptionClicked: onXColumnClicked,
//       // selectedOption: xColumn
//     });

//   select('#y-menu')
//     .call(dropdownMenu, {
//       options: numericColNames,
//       // onOptionClicked: onYColumnClicked,
//       // selectedOption: yColumn
//     });
// }
