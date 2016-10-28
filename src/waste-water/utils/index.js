const COLUMNS = require('../constants/columns.js');
const REGEX = require('../constants/regex.js');

function sortId([district1, block1, number1], [district2, block2, number2]) {
  if (district1 < district2) return -1;
  if (district1 > district2) return 1;
  if (block1 < block2) return -1;
  if (block1 > block2) return 1;
  if (number1 < number2) return -1;
  if (number1 > number2) return 1;
  return 0;
}

function sort2D([septicId1, houseId1], [septicId2, houseId2]) {
  const sortOrder = sortId(septicId1, septicId2);
  if (sortOrder !== 0) return sortOrder;
  return sortId(houseId1, houseId2);
}

function getHouseId({ district, row }) {
  const houseErrors = [];
  const rowNo = Number(row[COLUMNS.ACTED[district].NO]);
  if (!rowNo) return {};
  const id1 = row[COLUMNS.ACTED[district].HOUSE.ID];
  const id2 = id1.replace('-HH', '-H');
  const district1 = Number(id2.match(REGEX.DISTRICT)[1]);
  const block1 = Number(id2.match(REGEX.BLOCK)[1]);
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

function getSepticId({ district, row }) {
  const septicErrors = [];
  const rowNo = Number(row[COLUMNS.ACTED[district].NO]);
  if (!rowNo) return {};
  const id1 = row[COLUMNS.ACTED[district].SEPTIC.ID_1];
  const id2 = row[COLUMNS.ACTED[district].SEPTIC.ID_2];
  const district1 = Number(row[COLUMNS.ACTED[district].SEPTIC.DISTRICT_1]);
  const district2 = Number(row[COLUMNS.ACTED[district].SEPTIC.DISTRICT_2]);
  const block1 = Number(row[COLUMNS.ACTED[district].SEPTIC.BLOCK_1]);
  const block2 = Number(row[COLUMNS.ACTED[district].SEPTIC.BLOCK_2]);
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

function sortErrors([a], [b]) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (String(a) < String(b)) return -1;
  if (String(a) > String(b)) return 1;
  return 0;
}

module.exports = {
  getHouseId,
  getSepticId,
  sortErrors,
  sort2D,
};
