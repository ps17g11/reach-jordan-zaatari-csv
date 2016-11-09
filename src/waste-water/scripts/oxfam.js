const fs = require('fs');
const d3Dsv = require('d3-dsv');
const utils = require('../utils/index.js');

function writeFile({ csv, district, errorCsv }) {
  const csvWritePath = utils.getCsvPath({ district, partner: 'oxfam', type: 'output' });
  fs.writeFile(csvWritePath, csv, (err) => {
    if (err) throw err;
  });
  fs.writeFile(`${csvWritePath.slice(0, -4)}-errors.csv`, errorCsv, (err) => {
    if (err) throw err;
  });
}

module.exports = ({ columns, district, header }) => {
  const csvReadPath = utils.getCsvPath({ district, partner: 'oxfam', type: 'input' });
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(header);
    const concatText = rawText.substring(match[0].length);
    const data = d3Dsv.csvParse(concatText);
    const { obj, errorRows } = utils.transformOxfamData({ data, columns });
    const csv = utils.transformObj({ obj });
    const errorRowsSorted = errorRows.sort(utils.sortErrors);
    const errorRowsToString = errorRowsSorted.map((item) => item.join(','));
    const errorCsv = ['No.,Error Type,Value 1,Value 2', ...errorRowsToString].join('\n');
    writeFile({ csv, district, errorCsv });
  });
};
