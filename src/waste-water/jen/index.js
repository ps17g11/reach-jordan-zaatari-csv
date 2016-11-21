const COLUMNS = require('./columns.js');
const transform = require('../utils/transform.js');
const partnerUtils = require('./utils.js');

const FIRST_FOUR_LINES = /^(?:.*\r?\n?){4}/;

transform({
  columns: COLUMNS.DISTRICT_3_4,
  district: '3-4',
  header: FIRST_FOUR_LINES,
  partner: 'jen',
  partnerUtils,
});
