const mappedColumns = [
  'septicTank',
  'capacity',
  'steelTank',
  'houseHolds',
].join(',');
// const normalizedColumns = [
//   'septicDistrict',
//   'septicBlock',
//   'septicNumber',
//   'septicID',
//   'houseHoldDistrict',
//   'houseHoldBlock',
//   'houseHoldNumber',
//   'houseHoldID',
// ].join(',');

function getCsvPath({ district, partner, type }) {
  return `./data/waste-water/${type}/${partner}/district-${district}.csv`;
}

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

function mappedToCSV({ obj }) {
  const csv = Object.entries(obj)
    .map(([key, value]) => ([
      key,
      value.capacity,
      value.steelTank,
      `"${value.houseHolds.join(',')}"`,
    ].join(',')));
  csv.unshift(mappedColumns);
  return csv.join('\n');
}

// function normalizedToCSV({ data }) {
//   const csv = data.map((row) => ([
//     key,
//     value.capacity,
//     value.steelTank,
//     `"${value.houseHolds.join(',')}"`,
//   ].join(',')));
//   csv.unshift(normalizedColumns);
//   return csv.join('\n');
// }

module.exports = {
  getCsvPath,
  sort2D,
  sortErrors,
  mappedToCSV,
};
