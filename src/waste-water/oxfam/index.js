const COLUMNS = require('./constants/columns.js');
const REGEX = require('./constants/regex.js');
const oxfam = require('./scripts/oxfam.js');

oxfam({
  columns: COLUMNS.OXFAM.DISTRICT_5,
  district: 5,
  header: REGEX.FIRST_LINE,
});

oxfam({
  columns: COLUMNS.OXFAM.DISTRICT_6,
  district: 6,
  header: REGEX.FIRST_THREE_LINES,
});

oxfam({
  columns: COLUMNS.OXFAM.DISTRICT_7,
  district: 7,
  header: REGEX.FIRST_LINE,
});

oxfam({
  columns: COLUMNS.OXFAM.DISTRICT_8,
  district: 8,
  header: REGEX.FIRST_TWO_LINES,
});
