const fs = require('fs');
const d3Dsv = require('d3-dsv');
const utils = require('../utils/index.js');
const utilsActed = require('./utils.js');

function normalizeData({ data, columns }) {
  return data
    .filter((row) => row[columns.SEPTIC.ID] && row[columns.HOUSEHOLD.ID])
    .map((row) => {
      const [septicDistrict, septicBlock, septicNumber] = utils.parseId({
        id: row[columns.SEPTIC.ID] });
      const [householdDistrict, householdBlock, householdNumber] = utils.parseId({
        id: row[columns.HOUSEHOLD.ID] });
      const normalizedRow = {
        septicDistrict: Number(septicDistrict),
        septicBlock: Number(septicBlock),
        septicNumber: Number(septicNumber),
        septicCapacity: Number(row[columns.SEPTIC.CAPACITY]),
        householdDistrict: Number(householdDistrict),
        householdBlock: Number(householdBlock),
        householdNumber: Number(householdNumber) || householdNumber,
        steelTank: utilsActed.parseSteelTank({ tankId: row[columns.STEEL.ID] }),
      };
      utils.testData({ row, normalizedRow });
      return normalizedRow;
    })
    .sort(utils.sortRows);
}

module.exports = ({ columns, district, header }) => {
  const csvReadPath = utils.getReadPath({ district, io: 'input', partner: 'acted' });
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(header);
    const concatText = rawText.substring(match[0].length);
    const cleanText = utilsActed.replaceHeaders({ columns, district, text: concatText });
    const data = d3Dsv.csvParse(cleanText);
    const normalizedData = normalizeData({ columns, data });
    const normalizedCSV = utils.normalizedToCSV({ rows: normalizedData });
    const mappedObj = normalizedData.reduce(utils.mapRowsByTank, {});
    const mappedCSV = utils.mappedToCSV({ obj: mappedObj });
    const writePathNormalized = utils.getWritePath({
      district, partner: 'acted', type: 'normalized' });
    const writePathMapped = utils.getWritePath({
      district, partner: 'acted', type: 'mapped' });
    utils.writeFile({ csv: normalizedCSV, writePath: writePathNormalized });
    utils.writeFile({ csv: mappedCSV, writePath: writePathMapped });
  });
};
