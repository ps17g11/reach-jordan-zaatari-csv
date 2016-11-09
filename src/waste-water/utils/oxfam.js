const REGEX = require('../constants/regex.js');
const utils = require('./index.js');

let blockGlobal = 0;

function getHouseId({ columns, row }) {
  const houseErrors = [];
  const id1 = row[columns.HOUSE.ID];
  if (!id1) return {};
  const id2 = id1.replace('-HH', '-H');
  const district1 = Number((id2.match(REGEX.DISTRICT) || ['', ''])[1]);
  const block1 = Number((id2.match(REGEX.BLOCK) || ['', ''])[1]);
  const number1 = Number(id2.split('-H')[1]) || id2.split('-H')[1];
  const hasValidId = REGEX.HOUSEHOLD_ID.test(id2);
  if (!hasValidId) {
    const record = [rowNo, 'Invalid Household ID Format', id2, ''];
    houseErrors.push(record);
  }
  return {
    houseId: [district1, block1, number1],
    houseErrors,
  };
}

function getSepticId({ index, columns, row }) {
  const septicErrors = [];
  const id = row[columns.SEPTIC.NUMBER];
  if (!id) return {};
  const district = id.match(REGEX.DISTRICT)[0];
  const blockString = row[columns.SEPTIC.BLOCK];
  const block = Number(blockString.match(REGEX.NUMBER)[0]) || blockGlobal;
  if (blockString) blockGlobal = block;
  const number = Number(id.split('-T')[1]);
  const hasValidId = REGEX.SEPTIC_ID.test(id);
  const hasBlockMatch = id.includes(`-B${block}-T`);
  if (!hasBlockMatch) {
    const record = [index, 'Block Mismatch', block, id];
    septicErrors.push(record);
  }
  if (!hasValidId) {
    const record = [index, 'Septic ID Format Invalid', id, ''];
    septicErrors.push(record);
  }
  return {
    septicId: [district, block, number],
    septicErrors,
  };
}

module.exports = ({ data, columns }) => {
  const errorRows = [];
  const array = [];
  const obj = {};
  for (const [index, row] of data.entries()) {
    const { septicId, septicErrors } = getSepticId({ index: index + 1, row, columns });
    const { houseId, houseErrors } = getHouseId({ index: index + 1, row, columns });
    if (septicErrors) errorRows.push(...septicErrors);
    if (houseErrors) errorRows.push(...houseErrors);
    if (septicId && houseId) {
      const capacity = Number(row[columns.SEPTIC.CAPACITY]);
      const steelTank = row[columns.STEEL.ID] || '';
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
  return {
    obj,
    errorRows,
  };
};
