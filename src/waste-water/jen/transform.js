const fs = require('fs');
const d3Dsv = require('d3-dsv');
const utils = require('../utils/index.js');

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

function normalizeData({ data, columns }) {
  return data
    .filter((row) => row[columns.SEPTIC.NUMBER])
    .map((row) => {
      const normalizedRow = {
        septicDistrict: Number(row[columns.SEPTIC.DISTRICT]),
        septicBlock: Number(row[columns.SEPTIC.BLOCK]),
        septicNumber: Number(row[columns.SEPTIC.NUMBER]),
        septicCapacity: Number(row[columns.SEPTIC.CAPACITY]),
        householdDistrict: Number(row[columns.HOUSE.DISTRICT]),
        householdBlock: Number(row[columns.HOUSE.BLOCK]),
        householdNumber: parseHouseholdNumber(row[columns.HOUSE.NUMBER]),
        steelTank: parseSteelTank(row[columns.STEEL.ID]),
      };
      testData({ row, normalizedRow });
      return normalizedRow;
    });
}

module.exports = ({ columns, district, header }) => {
  const csvReadPath = utils.getReadPath({ district, io: 'input', partner: 'jen' });
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(header);
    const concatText = rawText.substring(match[0].length);
    const cleanText = concatText.replace(columns.STEEL.CAPACITY, columns.SEPTIC.CAPACITY);
    const data = d3Dsv.csvParse(cleanText);
    const normalizedData = normalizeData({ columns, data });
    const normalizedCSV = utils.normalizedToCSV({ rows: normalizedData });
    const mappedObj = normalizedData.reduce(utils.mapRowsByTank, {});
    const mappedCSV = utils.mappedToCSV({ obj: mappedObj });
    const writePathNormalized = utils.getWritePath({
      district: '3-4', io: 'output', partner: 'jen', type: 'normalized' });
    const writePathMapped = utils.getWritePath({
      district: '3-4', io: 'output', partner: 'jen', type: 'mapped' });
    utils.writeFile({ csv: normalizedCSV, writePath: writePathNormalized });
    utils.writeFile({ csv: mappedCSV, writePath: writePathMapped });
  });
};
