const COLUMNS = require('./columns.js');
const transform = require('../utils/transform.js');
const partnerUtils = require('./utils.js');

const FIRST_LINE = /^.*\r?\n?/;
const FIRST_FOUR_LINES = /^(?:.*\r?\n?){4}/;

transform({
  columns: COLUMNS.DISTRICT_1,
  district: 1,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_2_9_11,
  district: 2,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_2_9_11,
  district: 9,
  header: FIRST_LINE,
  partner: 'acted',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_10,
  district: 10,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_2_9_11,
  district: 11,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
});

transform({
  columns: COLUMNS.DISTRICT_12,
  district: 12,
  header: FIRST_FOUR_LINES,
  partner: 'acted',
  partnerUtils,
});
