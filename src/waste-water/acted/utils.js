const utils = require('../utils/index.js');

function replaceHeaders({ columns, district, text }) {
  let cleanText = text;
  cleanText = cleanText.replace(columns.SEPTIC.DISTRICT, columns.SEPTIC.DISTRICT_OLD);
  if (district === 10) {
    cleanText = cleanText.replace(columns.SEPTIC.BLOCK, columns.SEPTIC.BLOCK_OLD);
  }
  cleanText = cleanText.replace(columns.STEEL.CAPACITY, columns.SEPTIC.CAPACITY);
  return cleanText;
}

function parseSteelTank({ tankId }) {
  if (!tankId) return '';
  const [type, district, number] = tankId.split('-');
  return `${type}-${Number(district)}-${Number(number)}`;
}

function normalizeData({ columns, data }) {
  return data
    .filter((row) => row[columns.SEPTIC.ID])
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
        steelTank: parseSteelTank({ tankId: row[columns.STEEL.ID] }),
      };
      utils.testData({ row, normalizedRow });
      return normalizedRow;
    })
    .sort(utils.sortRows);
}

module.exports = {
  normalizeData,
  replaceHeaders,
};
