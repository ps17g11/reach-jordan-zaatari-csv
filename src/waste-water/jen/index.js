const XLSX = require('xlsx');
const COLUMNS = require('./columns.js');
const transform = require('../utils/transform.js');
const partnerUtils = require('./utils.js');

const FIRST_FOUR_LINES = /^(?:.*\r?\n?){4}/;

const workbook = XLSX.readFile('./data/waste-water/input/jen.xlsx');
const [d3and4] = workbook.SheetNames;
const district3and4 = XLSX.utils.sheet_to_csv(workbook.Sheets[d3and4]);

transform({
  columns: COLUMNS.DISTRICT_3_4,
  district: '3-4',
  header: FIRST_FOUR_LINES,
  partner: 'jen',
  partnerUtils,
  rawText: district3and4,
});
