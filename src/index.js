import { select, csv } from 'd3';
import { numericColNames } from './numeric_cols';
import { dropdownMenu } from './dropdown_menu';

const svg = select('graph');

// Read col
csv('../data/phl_hec_all_confirmed.csv').then(data => {
  data.forEach((d) => {
    numericColNames.forEach(col => {
      d[col] = +d[col];
    })     
  })
})

const render = () => {
  select('#x-menu')
    .call(dropdownMenu, {
      options: numericColNames,
      // onOptionClicked: onXColumnClicked,
      // selectedOption: xColumn
    });

  select('#y-menu')
    .call(dropdownMenu, {
      options: numericColNames,
      // onOptionClicked: onYColumnClicked,
      // selectedOption: yColumn
    });
}
