const fs = require('fs');
const d3Dsv = require('d3-dsv');
const { COLUMNS, PATHS, REGEX } = require('./constants.js');
const utils = require('../utils/index.js');

function writeFile({ csv }) {
  fs.writeFile(PATHS.WRITE.MAPPED, csv, (err) => {
    if (err) throw err;
  });
}

function getSepticId({ row }) {
  const district = Number(row[COLUMNS.SEPTIC.DISTRICT]);
  const block = Number(row[COLUMNS.SEPTIC.BLOCK]);
  const number = Number(row[COLUMNS.SEPTIC.NUMBER]);
  if (!district || !block || !number) return null;
  return [district, block, number];
}

function getHouseId({ row }) {
  const district = Number(row[COLUMNS.HOUSE.DISTRICT]);
  const block = Number(row[COLUMNS.HOUSE.BLOCK]);
  const number = Number(row[COLUMNS.HOUSE.NUMBER]);
  if (!district || !block || !number) return null;
  return [district, block, number];
}

function mapData(prevObj, row) {
  const obj = prevObj;
  const septicId = getSepticId({ row });
  const houseId = getHouseId({ row });
  if (septicId && houseId) {
    obj[septicId] = obj[septicId] || {};
    obj[septicId].capacity = Number(row[COLUMNS.SEPTIC.CAPACITY]);
    obj[septicId].steelTank = row[COLUMNS.STEEL.ID] || '';
    obj[septicId].houseHolds = obj[septicId].houseHolds || [];
    obj[septicId].houseHolds.push(houseId);
  }
  return obj;
}

fs.readFile(PATHS.READ, 'utf8', (err, rawText) => {
  if (err) throw err;
  const match = rawText.match(REGEX.FIRST_FOUR_LINES);
  const concatText = rawText.substring(match[0].length);
  const cleanText = concatText.replace(COLUMNS.STEEL.CAPACITY, COLUMNS.SEPTIC.CAPACITY);
  const data = d3Dsv.csvParse(cleanText);
  const mappedObj = data.reduce(mapData, {});
  const csv = utils.mappedToCSV({ obj: mappedObj });
  writeFile({ csv });
});
