const mappedColumns = [
  'septic_tank',
  'capacity',
  'steel_tank',
  'households',
].join(',');
const normalizedColumns = [
  'septic_district',
  'septic_block',
  'septic_number',
  'septic_id',
  'septic_capacity',
  'household_district',
  'household_block',
  'household_number',
  'household_id',
  'steel_tank',
].join(',');

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

function mapRowsByTank(prevObj, row) {
  const obj = prevObj;
  const septicId = `D${row.septicDistrict}-B${row.septicBlock}-T${row.septicNumber}`;
  const houseId = `D${row.householdDistrict}-B${row.householdBlock}-H${row.householdNumber}`;
  obj[septicId] = obj[septicId] || {};
  obj[septicId].capacity = row.septicCapacity;
  obj[septicId].steelTank = row.steelTank;
  obj[septicId].households = obj[septicId].households || [];
  obj[septicId].households.push(houseId);
  return obj;
}

function mappedToCSV({ obj }) {
  const csv = Object.entries(obj)
    .map(([key, value]) => ([
      key,
      value.capacity,
      value.steelTank,
      `"${value.households.join(',')}"`,
    ].join(',')));
  csv.unshift(mappedColumns);
  return csv.join('\n');
}

function normalizedToCSV({ rows }) {
  const csv = rows.map((row) => ([
    row.septicDistrict,
    row.septicBlock,
    row.septicNumber,
    `D${row.septicDistrict}-B${row.septicBlock}-T${row.septicNumber}`,
    row.septicCapacity,
    row.householdDistrict,
    row.householdBlock,
    row.householdNumber,
    `D${row.householdDistrict}-B${row.householdBlock}-H${row.householdNumber}`,
    row.steelTank,
  ].join(',')));
  csv.unshift(normalizedColumns);
  return csv.join('\n');
}

module.exports = {
  getCsvPath,
  sort2D,
  sortErrors,
  mapRowsByTank,
  mappedToCSV,
  normalizedToCSV,
};
