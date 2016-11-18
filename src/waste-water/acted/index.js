const COLUMNS = require('./constants/columns.js');
const REGEX = require('./constants/regex.js');
const acted = require('./scripts/acted.js');

acted({
  columns: COLUMNS.ACTED.DISTRICT_1,
  district: 1,
  header: REGEX.FIRST_FOUR_LINES,
});

acted({
  columns: COLUMNS.ACTED.DISTRICT_2_9_11,
  district: 2,
  header: REGEX.FIRST_FOUR_LINES,
});

acted({
  columns: COLUMNS.ACTED.DISTRICT_2_9_11,
  district: 9,
  header: REGEX.FIRST_LINE,
});

acted({
  columns: COLUMNS.ACTED.DISTRICT_10,
  district: 10,
  header: REGEX.FIRST_FOUR_LINES,
});

acted({
  columns: COLUMNS.ACTED.DISTRICT_2_9_11,
  district: 11,
  header: REGEX.FIRST_FOUR_LINES,
});

acted({
  columns: COLUMNS.ACTED.DISTRICT_12,
  district: 12,
  header: REGEX.FIRST_FOUR_LINES,
});
