import { select, csv } from 'd3';

const svg = select('graph');

csv('../data/phl_hec_all_confirmed.csv')
  .then(data => {
    console.log(data)
  })