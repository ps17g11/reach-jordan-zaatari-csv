const fs = require('fs');
const d3Dsv = require('d3-dsv');
const utils = require('../utils/index.js');
const utilsJen = require('./utils.js');

function normalizeData({ data, columns }) {
  return data
    .filter((row) => row[columns.SEPTIC.NUMBER])
    .map((row) => {
      const normalizedRow = {
        septicDistrict: Number(row[columns.SEPTIC.DISTRICT]),
        septicBlock: Number(row[columns.SEPTIC.BLOCK]),
        septicNumber: Number(row[columns.SEPTIC.NUMBER]),
        septicCapacity: Number(row[columns.SEPTIC.CAPACITY]),
        householdDistrict: Number(row[columns.HOUSEHOLD.DISTRICT]),
        householdBlock: Number(row[columns.HOUSEHOLD.BLOCK]),
        householdNumber: utilsJen.parseHouseholdNumber({ number: row[columns.HOUSEHOLD.NUMBER] }),
        steelTank: utilsJen.parseSteelTank({ tankId: row[columns.STEEL.ID] }),
      };
      utils.testData({ row, normalizedRow });
      return normalizedRow;
    })
    .sort(utils.sortRows);
}

module.exports = ({ columns, district, header }) => {
  const csvReadPath = utils.getReadPath({ district, partner: 'jen' });
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
      district: '3-4', partner: 'jen', type: 'normalized' });
    const writePathMapped = utils.getWritePath({
      district: '3-4', partner: 'jen', type: 'mapped' });
    utils.writeFile({ csv: normalizedCSV, writePath: writePathNormalized });
    utils.writeFile({ csv: mappedCSV, writePath: writePathMapped });
  });
};
