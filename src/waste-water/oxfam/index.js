const XLSX = require('xlsx');
const COLUMNS = require('./columns.js');
const transform = require('../utils/transform.js');
const partnerUtils = require('./utils.js');

const FIRST_LINE = /^.*\r?\n?/;
const FIRST_TWO_LINES = /^(?:.*\r?\n?){2}/;
const FIRST_THREE_LINES = /^(?:.*\r?\n?){3}/;

const workbookOld = XLSX.readFile('./data/waste-water/input/oxfam-old.xlsx');
const workbookNew = XLSX.readFile('./data/waste-water/input/oxfam-new.xlsx');
const [, d6, , d8] = workbookOld.SheetNames;
const [d5, d7] = workbookNew.SheetNames;
const district5 = XLSX.utils.sheet_to_csv(workbookNew.Sheets[d5]);
const district6 = XLSX.utils.sheet_to_csv(workbookOld.Sheets[d6]);
const district7 = XLSX.utils.sheet_to_csv(workbookNew.Sheets[d7]);
const district8 = XLSX.utils.sheet_to_csv(workbookOld.Sheets[d8]);

transform({
  columns: COLUMNS.DISTRICT_5,
  district: 5,
  header: FIRST_LINE,
  partner: 'oxfam',
  partnerUtils,
  rawText: district5,
});

transform({
  columns: COLUMNS.DISTRICT_6,
  district: 6,
  header: FIRST_THREE_LINES,
  partner: 'oxfam',
  partnerUtils,
  rawText: district6,
});

transform({
  columns: COLUMNS.DISTRICT_7,
  district: 7,
  header: FIRST_LINE,
  partner: 'oxfam',
  partnerUtils,
  rawText: district7,
});

transform({
  columns: COLUMNS.DISTRICT_8,
  district: 8,
  header: FIRST_TWO_LINES,
  partner: 'oxfam',
  partnerUtils,
  rawText: district8,
});
