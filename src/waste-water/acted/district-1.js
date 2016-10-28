const fs = require('fs');
const d3Dsv = require('d3-dsv');
const COLUMNS = require('../constants/columns.js');
const REGEX = require('../constants/regex.js');
const utils = require('../utils/index.js');

function writeFile({ csv, errorCsv, csvWritePath }) {
  fs.writeFile(csvWritePath, csv, (err) => {
    if (err) throw err;
  });
  fs.writeFile(`${csvWritePath.slice(0, -4)}-errors.csv`, errorCsv, (err) => {
    if (err) throw err;
  });
}

module.exports = ({ csvReadPath, csvWritePath }) => {
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(REGEX.FIRST_FOUR_LINES);
    const district = 1;
    const concatText = rawText.substring(match[0].length);
    const cleanText1 = concatText.replace(
      COLUMNS.ACTED[district].SEPTIC.DISTRICT_2,
      COLUMNS.ACTED[district].SEPTIC.DISTRICT_1
    );
    const cleanText2 = cleanText1.replace(
      COLUMNS.ACTED[district].STEEL.CAPACITY,
      COLUMNS.ACTED[district].SEPTIC.CAPACITY
    );
    const data = d3Dsv.csvParse(cleanText2);
    const { obj, errorRows } = utils.transformActedData({ data, district });
    const csv = utils.transformObj({ obj });
    const errorRowsSorted = errorRows.sort(utils.sortErrors);
    const errorRowsToString = errorRowsSorted.map((item) => item.join(','));
    const errorCsv = ['No.,Error Type,Value 1,Value 2', ...errorRowsToString].join('\n');
    writeFile({ csv, errorCsv, csvWritePath });
  });
};
