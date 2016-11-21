const utils = require('../utils/index.js');

function replaceHeaders({ text }) {
  return text;
}

function parseSteelTank({ district, tankId }) {
  if (!tankId || !parseInt(tankId, 10)) return '';
  const [number, type] = tankId.split('-');
  return `${type}T-${Number(district)}-${Number(number)}`;
}

function normalizeData({ columns, data }) {
  let prevCapacity = 0;
  return data
    .filter((row) => row[columns.SEPTIC.ID])
    .map((row) => {
      const [septicDistrict, septicBlock, septicNumber] = utils.parseId({
        id: row[columns.SEPTIC.ID] });
      const [householdDistrict, householdBlock, householdNumber] = utils.parseId({
        id: row[columns.HOUSEHOLD.ID] });
      const septicCapacity = Number(row[columns.SEPTIC.CAPACITY]) || prevCapacity;
      prevCapacity = septicCapacity;
      const normalizedRow = {
        septicDistrict: Number(septicDistrict),
        septicBlock: Number(septicBlock),
        septicNumber: Number(septicNumber),
        septicCapacity,
        householdDistrict: Number(householdDistrict),
        householdBlock: Number(householdBlock),
        householdNumber: Number(householdNumber) || householdNumber,
        steelTank: parseSteelTank({ district: septicDistrict, tankId: row[columns.STEEL.ID] }),
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
