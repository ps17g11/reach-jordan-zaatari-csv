const path = require('path');
const fs = require('fs');
const REGEX = require('./regex.js');

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

function getReadPath({ district, partner }) {
  return path.resolve(`./data/waste-water/input/${partner}/district-${district}.csv`);
}

function getWritePath({ district, partner, type }) {
  return path.resolve(`./data/waste-water/output/${partner}/${type}/district-${district}.csv`);
}

function writeFile({ csv, writePath }) {
  fs.writeFile(writePath, csv, (err) => {
    if (err) throw err;
  });
}

function sortRows(a, b) {
  if (a.septicDistrict < b.septicDistrict) return -1;
  if (a.septicDistrict > b.septicDistrict) return 1;
  if (a.septicBlock < b.septicBlock) return -1;
  if (a.septicBlock > b.septicBlock) return 1;
  if (a.septicNumber < b.septicNumber) return -1;
  if (a.septicNumber > b.septicNumber) return 1;
  if (a.householdDistrict < b.householdDistrict) return -1;
  if (a.householdDistrict > b.householdDistrict) return 1;
  if (a.householdBlock < b.householdBlock) return -1;
  if (a.householdBlock > b.householdBlock) return 1;
  if (parseInt(a.householdNumber, 10) < parseInt(b.householdNumber, 10)) return -1;
  if (parseInt(a.householdNumber, 10) > parseInt(b.householdNumber, 10)) return 1;
  if (String(a.householdNumber) < String(b.householdNumber)) return -1;
  if (String(a.householdNumber) > String(b.householdNumber)) return 1;
  return 0;
}

function parseId({ id }) {
  const match = id.match(REGEX.ID_PARSER);
  if (!match) return [0, 0, 0];
  const [, district, block, number] = match;
  return [district, block, number];
}

function testData({ row, normalizedRow }) {
  const values = Object.values(normalizedRow);
  if (values.some((number) => Number.isNaN(number))) {
    console.log(row);
    console.log(normalizedRow);
    throw new Error(row['No.']);
  }
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
  getReadPath,
  getWritePath,
  writeFile,
  sortRows,
  mapRowsByTank,
  mappedToCSV,
  normalizedToCSV,
  parseId,
  testData,
};
