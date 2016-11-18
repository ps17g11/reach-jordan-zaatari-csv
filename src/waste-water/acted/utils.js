const REGEX = require('../constants/regex.js');
const utils = require('././index.js');

function getHouseId({ columns, row }) {
  const houseErrors = [];
  const rowNo = Number(row[columns.NO]);
  if (!rowNo) return {};
  const id1 = row[columns.HOUSE.ID];
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

function getSepticId({ columns, row }) {
  const septicErrors = [];
  const rowNo = Number(row[columns.NO]);
  if (!rowNo) return {};
  const id1 = row[columns.SEPTIC.ID_1];
  const id2 = row[columns.SEPTIC.ID_2];
  const district1 = Number(row[columns.SEPTIC.DISTRICT_1]);
  const district2 = Number(row[columns.SEPTIC.DISTRICT_2]) || district1;
  const block1 = Number(row[columns.SEPTIC.BLOCK_1]);
  const block2 = Number(row[columns.SEPTIC.BLOCK_2]) || block1;
  const number = Number(id2.split('-T')[1]);
  const compositeId = `D${district2}-B${block2}-T${number}`;
  const hasValidId = REGEX.SEPTIC_ID.test(id2);
  const hasDistrictMatch = id2.includes(`D${district2}-B`);
  const hasBlockMatch = id2.includes(`-B${block2}-T`);
  const hasIdMatch = id2 === compositeId;
  if (district1 !== district2) {
    const record = [rowNo, 'District Mismatch', district1, district2];
    septicErrors.push(record);
  }
  if (block1 !== block2) {
    const record = [rowNo, 'Block Mismatch', block1, block2];
    septicErrors.push(record);
  }
  if (id1 !== id2) {
    const record = [rowNo, 'Septic ID Mismatch', id1, id2];
    septicErrors.push(record);
  }
  if (!hasDistrictMatch || !hasBlockMatch || !hasIdMatch) {
    const record = [rowNo, 'Septic ID Composite Mismatch', id2, compositeId];
    septicErrors.push(record);
  }
  if (!hasValidId) {
    const record = [rowNo, 'Septic ID Format Invalid', id2, ''];
    septicErrors.push(record);
  }
  return {
    septicId: [district2, block2, number],
    septicErrors,
  };
}

module.exports = ({ data, columns }) => {
  const errorRows = [];
  const array = [];
  const obj = {};
  for (const row of data) {
    const { septicId, septicErrors } = getSepticId({ row, columns });
    const { houseId, houseErrors } = getHouseId({ row, columns });
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
