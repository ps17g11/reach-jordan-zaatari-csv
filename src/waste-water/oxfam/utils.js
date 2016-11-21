const utils = require('../utils/index.js');

function replaceHeaders({ text }) {
  return text;
}

function getSepticCapacity({ columns, district, prevCapacity, row }) {
  if (district === 6) {
    if (Number(row[columns.SEPTIC.CAPACITY_8M3]) > 0) return 8;
    if (Number(row[columns.SEPTIC.CAPACITY_2M3]) > 0) return 2;
    return prevCapacity;
  }
  return Number(row[columns.SEPTIC.CAPACITY]) || prevCapacity;
}

function parseSteelTank({ district, tankId }) {
  if (!tankId || !parseInt(tankId, 10)) return '';
  const [number, type] = tankId.split('-');
  return `${type}T-${Number(district)}-${Number(number)}`;
}

function normalizeData({ columns, data, district }) {
  let prevCapacity = 0;
  return data
    .filter((row) => row[columns.SEPTIC.ID])
    .map((row) => {
      const [septicDistrict, septicBlock, septicNumber] = utils.parseId({
        id: row[columns.SEPTIC.ID] });
      const [householdDistrict, householdBlock, householdNumber] = utils.parseId({
        id: row[columns.HOUSEHOLD.ID] });
      const septicCapacity = getSepticCapacity({ columns, district, prevCapacity, row });
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
