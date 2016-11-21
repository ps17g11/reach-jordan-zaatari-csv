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

function mappedToCSV({ obj }) {
  const csv = Object.entries(obj)
    .map(([key, value]) => ([
      key,
      value.capacity,
      value.steelTank,
      `"${value.households.join(',')}"`,
    ].join(',')));
  return [mappedColumns, ...csv].join('\n');
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
  return [normalizedColumns, ...csv].join('\n');
}

module.exports = {
  mappedToCSV,
  normalizedToCSV,
};
