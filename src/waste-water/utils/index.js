const transformActedData = require('./acted.js');

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

function sortErrors([a], [b]) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (String(a) < String(b)) return -1;
  if (String(a) > String(b)) return 1;
  return 0;
}

function transformObj({ obj }) {
  let csv = 'septicTank,capacity,steelTank,houseHolds\n';
  for (const tank of Object.keys(obj)) {
    csv += `${tank},${obj[tank].capacity},${obj[tank].steelTank},${obj[tank].houseHolds.toString()}\n`;
  }
  return csv;
}

module.exports = {
  sort2D,
  sortErrors,
  transformActedData,
  transformObj,
};
