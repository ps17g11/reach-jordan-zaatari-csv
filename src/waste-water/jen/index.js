const COLUMNS = require('./constants/columns.js');
const REGEX = require('./constants/regex.js');
const transform = require('./transform.js');

transform({
  columns: COLUMNS.DISTRICT_3_4,
  district: '3-4',
  header: REGEX.FIRST_FOUR_LINES,
});
