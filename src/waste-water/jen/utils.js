const utils = require('../utils/index.js');

function replaceHeaders({ columns, text }) {
  return text.replace(columns.STEEL.CAPACITY, columns.SEPTIC.CAPACITY);
}

function parseHouseholdNumber({ number }) {
  return Number(number) || number.trim();
}

function parseSteelTank({ tankId }) {
  if (!tankId) return '';
  const [type, district, number] = tankId.split('-');
  return `${type}-${Number(district)}-${Number(number)}`;
}

function normalizeData({ data, columns }) {
  return data
    .filter((row) => row[columns.SEPTIC.ID])
    .map((row) => {
      const normalizedRow = {
        septicDistrict: Number(row[columns.SEPTIC.DISTRICT]),
        septicBlock: Number(row[columns.SEPTIC.BLOCK]),
        septicNumber: Number(row[columns.SEPTIC.ID]),
        septicCapacity: Number(row[columns.SEPTIC.CAPACITY]),
        householdDistrict: Number(row[columns.HOUSEHOLD.DISTRICT]),
        householdBlock: Number(row[columns.HOUSEHOLD.BLOCK]),
        householdNumber: parseHouseholdNumber({ number: row[columns.HOUSEHOLD.ID] }),
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
