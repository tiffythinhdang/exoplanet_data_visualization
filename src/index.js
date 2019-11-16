import { 
  select, 
  csv, 
  scaleLinear,
  scaleBand,
  max,
  axisLeft,
  axisBottom
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
  const xValue = (d) => d[numericColNames[45]];
  const yValue = (d) => d["P. Name"];

  // Set margin for the graph:
  const margin = { top: 50, right: 50, bottom: 50, left: 100,}
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  // Map data x-range to graph range
  const xScale = scaleLinear()
    .domain([ 0, max(data, xValue) ])
    .range([0, innerWidth]);

  // Map data y-range to graph range
  const yScale = scaleBand()
    .domain(data.map( d => yValue(d) ))
    .range([0, innerHeight])
    .padding(0.1);

  // Initialze a group to append the graph 
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Set up x-axis and y-axis
  const yAxis = axisLeft(yScale)
  const xAxis = axisBottom(xScale)
  g.append('g').call(yAxis);
  g.append('g').call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`) //move the axis to the bottom

// Render circle for each row
//   g.selectAll('circle').data(data)
//     .enter().append('circle')
//       .attr('cx', 100)
//       .attr('cy', 100)
//       .attr('r', 20);
// };

  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale( yValue(d) ))
      .attr('width', d => xScale( xValue(d) ))
      .attr('height', yScale.bandwidth());
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
