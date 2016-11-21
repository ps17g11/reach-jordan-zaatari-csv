const fs = require('fs');
const d3Dsv = require('d3-dsv');
const utils = require('../utils/index.js');

function writeFile({ csv, district }) {
  const csvWritePath = utils.getWritePath({ district, partner: 'acted', io: 'output' });
  fs.writeFile(csvWritePath, csv, (err) => {
    if (err) throw err;
  });
}

module.exports = ({ columns, district, header }) => {
  const csvReadPath = utils.getReadPath({ district, io: 'input', partner: 'acted' });
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(header);
    const concatText = rawText.substring(match[0].length);
    let cleanText = concatText;
    cleanText = cleanText.replace(
      columns.SEPTIC.DISTRICT_2,
      columns.SEPTIC.DISTRICT_1
    );
    if (district === 10) {
      cleanText = cleanText.replace(
        columns.SEPTIC.BLOCK_2,
        columns.SEPTIC.BLOCK_1
      );
    }
    cleanText = cleanText.replace(
      columns.STEEL.CAPACITY,
      columns.SEPTIC.CAPACITY
    );
    const data = d3Dsv.csvParse(cleanText);
    const { obj, errorRows } = utils.transformActedData({ data, columns });
    const csv = utils.transformObj({ obj });
    const errorRowsSorted = errorRows.sort(utils.sortErrors);
    const errorRowsToString = errorRowsSorted.map((item) => item.join(','));
    const errorCsv = ['No.,Error Type,Value 1,Value 2', ...errorRowsToString].join('\n');
    writeFile({ csv, district, errorCsv });
  });
};
