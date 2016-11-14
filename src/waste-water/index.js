const COLUMNS = require('./constants/columns.js');
const RESOURCES = require('./constants/resources.js');
const REGEX = require('./constants/regex.js');
const acted = require('./scripts/acted.js');
const jen = require('./scripts/jen.js');
const oxfam = require('./scripts/oxfam.js');

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


jen({
  csvReadPath: RESOURCES.JEN.DISTRICT_3_4.READ,
  csvWritePath: RESOURCES.JEN.DISTRICT_3_4.WRITE,
});
