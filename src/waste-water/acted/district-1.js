const fs = require('fs');
const d3Dsv = require('d3-dsv');
const COLUMNS = require('../constants/columns.js');
const REGEX = require('../constants/regex.js');
const utils = require('../utils/index.js');

const errorRows = [];

function writeFile({ csv, errorCsv, csvWritePath }) {
  fs.writeFile(csvWritePath, csv, (err) => {
    if (err) throw err;
  });
  fs.writeFile(`${csvWritePath.slice(0, -4)}-errors.csv`, errorCsv, (err) => {
    if (err) throw err;
  });
}

function transformData({ data, district }) {
  const array = [];
  const obj = {};
  for (const row of data) {
    const { septicId, septicErrors } = utils.getSepticId({ row, district });
    const { houseId, houseErrors } = utils.getHouseId({ row, district });
    if (septicErrors) errorRows.push(...septicErrors);
    if (houseErrors) errorRows.push(...houseErrors);
    if (septicId && houseId) {
      const capacity = Number(row[COLUMNS.ACTED[district].SEPTIC.CAPACITY]);
      const steelTank = row[COLUMNS.ACTED[district].STEEL.ID] || '';
      array.push([septicId, houseId, capacity, steelTank]);
    }
  }
  array.sort(utils.sort2D);
  for (const [septicIdArray, houseIdArray, capacity, steelTank] of array) {
    const septicId = `D${septicIdArray[0]}-B${septicIdArray[1]}-T${septicIdArray[2]}`;
    const houseId = `D${houseIdArray[0]}-B${houseIdArray[1]}-H${houseIdArray[2]}`;
    obj[septicId] = obj[septicId] || {};
    if (obj[septicId].capacity && obj[septicId].capacity !== capacity) {
      const record = [septicId, 'Capacity Mismatch', obj[septicId].capacity, capacity];
      errorRows.push(record);
    }
    obj[septicId].capacity = capacity;
    if (obj[septicId].steelTank && obj[septicId].steelTank !== steelTank) {
      const record = [septicId, 'Steel Tank Mismatch', obj[septicId].steelTank, steelTank];
      errorRows.push(record);
    }
    obj[septicId].steelTank = steelTank || '';
    obj[septicId].houseHolds = obj[septicId].houseHolds || [];
    obj[septicId].houseHolds.push(houseId);
  }
  return obj;
}

function transformObj({ obj }) {
  let csv = 'septicTank,capacity,steelTank,houseHolds\n';
  for (const tank of Object.keys(obj)) {
    csv += `${tank},${obj[tank].capacity},${obj[tank].steelTank},${obj[tank].houseHolds.toString()}\n`;
  }
  return csv;
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
    const obj = transformData({ data, district });
    const csv = transformObj({ obj });
    const errorRowsSorted = errorRows.sort(utils.sortErrors);
    const errorRowsToString = errorRowsSorted.map((item) => item.join(','));
    const errorCsv = ['No.,Error Type,Value 1,Value 2', ...errorRowsToString].join('\n');
    writeFile({ csv, errorCsv, csvWritePath });
  });
};
