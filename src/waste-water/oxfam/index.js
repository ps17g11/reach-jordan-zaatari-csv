const COLUMNS = require('./columns.js');
const transform = require('../utils/transform.js');
const partnerUtils = require('./utils.js');

const FIRST_LINE = /^.*\r?\n?/;
const FIRST_TWO_LINES = /^(?:.*\r?\n?){2}/;
const FIRST_THREE_LINES = /^(?:.*\r?\n?){3}/;

transform({
  columns: COLUMNS.DISTRICT_5,
  district: 5,
  header: FIRST_LINE,
  partner: 'oxfam',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_6,
  district: 6,
  header: FIRST_THREE_LINES,
  partner: 'oxfam',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_7,
  district: 7,
  header: FIRST_LINE,
  partner: 'oxfam',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_8,
  district: 8,
  header: FIRST_TWO_LINES,
  partner: 'oxfam',
  partnerUtils,
});
