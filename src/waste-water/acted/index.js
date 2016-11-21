const XLSX = require('xlsx');
const COLUMNS = require('./columns.js');
const transform = require('../utils/transform.js');
const partnerUtils = require('./utils.js');

const FIRST_LINE = /^.*\r?\n?/;
const FIRST_FOUR_LINES = /^(?:.*\r?\n?){4}/;

const workbook = XLSX.readFile('./data/waste-water/input/acted.xlsx');
const [d1, d2, d9, d10, d11, d12] = workbook.SheetNames;
const district1 = XLSX.utils.sheet_to_csv(workbook.Sheets[d1]);
const district2 = XLSX.utils.sheet_to_csv(workbook.Sheets[d2]);
const district9 = XLSX.utils.sheet_to_csv(workbook.Sheets[d9]);
const district10 = XLSX.utils.sheet_to_csv(workbook.Sheets[d10]);
const district11 = XLSX.utils.sheet_to_csv(workbook.Sheets[d11]);
const district12 = XLSX.utils.sheet_to_csv(workbook.Sheets[d12]);

transform({
  columns: COLUMNS.DISTRICT_1,
  district: 1,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
  rawText: district1,
});

transform({
  columns: COLUMNS.DISTRICT_2_9_11,
  district: 2,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
  rawText: district2,
});

transform({
  columns: COLUMNS.DISTRICT_2_9_11,
  district: 9,
  header: FIRST_LINE,
  partner: 'acted',
  partnerUtils,
  rawText: district9,
});

transform({
  columns: COLUMNS.DISTRICT_10,
  district: 10,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
  rawText: district10,
});

transform({
  columns: COLUMNS.DISTRICT_2_9_11,
  district: 11,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
  rawText: district11,
});

transform({
  columns: COLUMNS.DISTRICT_12,
  district: 12,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
  rawText: district12,
});
