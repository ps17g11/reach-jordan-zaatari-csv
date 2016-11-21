const ID_PARSER = /D0*(\d+)-B0*(\d+)-[HT]*\s*0*(.+)/i;

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

function parseId({ id }) {
  const match = id.match(ID_PARSER);
  if (!match) return [0, 0, 0];
  const [, district, block, number] = match;
  return [district, block, number];
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

module.exports = {
  mapRowsByTank,
  parseId,
  sortRows,
};

