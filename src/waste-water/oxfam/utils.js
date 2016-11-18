const REGEX = require('../constants/regex.js');
const utils = require('././index.js');

function getSepticId({ blockGlobal, columns, district, index, row }) {
  const septicErrors = [];
  const id = row[columns.SEPTIC.NUMBER];
  if (!id) return {};
  const blockString = row[columns.SEPTIC.BLOCK];
  const block = blockString.match(REGEX.NUMBER) ?
    Number(blockString.match(REGEX.NUMBER)[0]) : blockGlobal;
  const number = Number(id.split('-T')[1]);
  const hasValidId = REGEX.SEPTIC_ID_IRREGULARLY_PADDED.test(id);
  const hasBlockMatch = id.includes(`B${block}-T`) || id.includes(`B0${block}-T`);
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
    updatedBlockGlobal: block,
  };
}

function getHouseId({ blockGlobal, columns, district, index, row }) {
  const houseErrors = [];
  const id = row[columns.HOUSE.ID].replace(REGEX.HOUSEHOLD_ID_IRREGULAR_PADDING, '-H');
  if (!id) return {};
  let number = Number(id.split('-H')[1]) || id.split('-H')[1];
  if (typeof number === 'string') number = number.toUpperCase();
  if (!REGEX.HOUSEHOLD_NUMBER.test(number)) {
    const record = [index, 'Invalid Household Number Format', id, ''];
    houseErrors.push(record);
    return {
      houseId: null,
      houseErrors,
    };
  }
  if (!number) {
    const record = [index, 'Invalid Household ID Format', id, ''];
    houseErrors.push(record);
    return {
      houseId: null,
      houseErrors,
    };
  }
  return {
    houseId: [district, blockGlobal, number],
    houseErrors,
  };
}

module.exports = ({ data, district, columns }) => {
  let blockGlobal = 0;
  let capacityGlobal = 0;
  const errorRows = [];
  const array = [];
  const obj = {};
  for (const [index, row] of data.entries()) {
    const { septicId, septicErrors, updatedBlockGlobal,
     } = getSepticId({ blockGlobal, columns, district, index: index + 1, row });
    blockGlobal = updatedBlockGlobal;
    const { houseId, houseErrors,
      } = getHouseId({ blockGlobal, columns, district, index: index + 1, row });
    if (septicErrors) errorRows.push(...septicErrors);
    if (houseErrors) errorRows.push(...houseErrors);
    if (septicId && houseId) {
      let capacity = Number(row[columns.SEPTIC.CAPACITY]) || capacityGlobal;
      if (Number(row[columns.SEPTIC.CAPACITY_2M3])) capacity = 2;
      if (Number(row[columns.SEPTIC.CAPACITY_8M3])) capacity = 8;
      if (capacity) capacityGlobal = capacity;
      let steelTank = REGEX.OXFAM_STEEL_TANK.test(row[columns.STEEL.ID]) ?
        row[columns.STEEL.ID] : '';
      if (steelTank) {
        const parts = steelTank.split('-');
        steelTank = `${parts[1].substring(0, 1)}ST-${district}-${Number(parts[0])}`;
      }
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
