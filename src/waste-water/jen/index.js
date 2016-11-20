const fs = require('fs');
const d3Dsv = require('d3-dsv');
const { COLUMNS, PATHS, REGEX } = require('./constants.js');
const utils = require('../utils/index.js');

function writeFile({ csv, path }) {
  fs.writeFile(path, csv, (err) => {
    if (err) throw err;
  });
}

function filterData(row) {
  return row[COLUMNS.SEPTIC.NUMBER];
}

function parseHouseholdNumber(number) {
  return Number(number) || number.trim();
}

function parseSteelTank(steelTank) {
  if (!steelTank) return '';
  const parts = steelTank.split('-');
  return `${parts[0]}-${Number(parts[1])}-${Number(parts[2])}`;
}

function testData({ row, normalizedRow }) {
  const values = Object.values(normalizedRow);
  if (values.some((number) => Number.isNaN(number))) {
    throw new Error(row['No.']);
  }
}

function normalizeData(row) {
  const normalizedRow = {
    septicDistrict: Number(row[COLUMNS.SEPTIC.DISTRICT]),
    septicBlock: Number(row[COLUMNS.SEPTIC.BLOCK]),
    septicNumber: Number(row[COLUMNS.SEPTIC.NUMBER]),
    septicCapacity: Number(row[COLUMNS.SEPTIC.CAPACITY]),
    householdDistrict: Number(row[COLUMNS.HOUSE.DISTRICT]),
    householdBlock: Number(row[COLUMNS.HOUSE.BLOCK]),
    householdNumber: parseHouseholdNumber(row[COLUMNS.HOUSE.NUMBER]),
    steelTank: parseSteelTank(row[COLUMNS.STEEL.ID]),
  };
  testData({ row, normalizedRow });
  return normalizedRow;
}

fs.readFile(PATHS.READ, 'utf8', (err, rawText) => {
  if (err) throw err;
  const match = rawText.match(REGEX.FIRST_FOUR_LINES);
  const concatText = rawText.substring(match[0].length);
  const cleanText = concatText.replace(COLUMNS.STEEL.CAPACITY, COLUMNS.SEPTIC.CAPACITY);
  const data = d3Dsv.csvParse(cleanText);
  const normalizedData = data.filter(filterData).map(normalizeData);
  const normalizedCSV = utils.normalizedToCSV({ rows: normalizedData });
  const mappedObj = normalizedData.reduce(utils.mapRowsByTank, {});
  const mappedCSV = utils.mappedToCSV({ obj: mappedObj });
  writeFile({ csv: normalizedCSV, path: PATHS.WRITE.NORMALIZED });
  writeFile({ csv: mappedCSV, path: PATHS.WRITE.MAPPED });
});
