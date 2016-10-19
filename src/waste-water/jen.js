const fs = require('fs');
const d3Dsv = require('d3-dsv');
const COLUMNS = require('./constants/columns.js');

function writeFile({ csv, csvWritePath }) {
  fs.writeFile(csvWritePath, csv, (err) => {
    if (err) throw err;
  });
}

function getSepticId({ row }) {
  const district = Number(row[COLUMNS.JEN.SEPTIC.DISTRICT]);
  const block = Number(row[COLUMNS.JEN.SEPTIC.BLOCK]);
  const number = Number(row[COLUMNS.JEN.SEPTIC.NUMBER]);
  if (!district || !block || !number) return null;
  return `D${district}-B${block}-T${number}`;
}

function getHouseId({ row }) {
  const district = Number(row[COLUMNS.JEN.HOUSE.DISTRICT]);
  const block = Number(row[COLUMNS.JEN.HOUSE.BLOCK]);
  const number = Number(row[COLUMNS.JEN.HOUSE.NUMBER]);
  if (!district || !block || !number) return null;
  return `D${district}-B${block}-H${number}`;
}

function transformData({ data }) {
  const obj = {};
  for (const row of data) {
    const septicId = getSepticId({ row });
    const houseId = getHouseId({ row });
    if (septicId && houseId) {
      obj[septicId] = obj[septicId] || {};
      obj[septicId].capacity = Number(row[COLUMNS.JEN.SEPTIC.CAPACITY]);
      obj[septicId].steelTank = row[COLUMNS.JEN.STEEL.ID] || '';
      obj[septicId].houseHolds = obj[septicId].houseHolds || [];
      obj[septicId].houseHolds.push(houseId);
    }
  }
  return obj;
}

function transformObj({ obj }) {
  let csv = 'septicTank,capacity,steelTank,houseHolds\n';
  for (const tank of Object.keys(obj)) {
    csv += `${tank},${obj[tank].capacity},${obj[tank].steelTank},"${obj[tank].houseHolds.toString()}"\n`;
  }
  return csv;
}

module.exports = ({ csvReadPath, csvWritePath }) => {
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(/^(?:.*\r?\n){4}/);
    const concatText = rawText.substring(match[0].length);
    const cleanText = concatText.replace(/Capacity \(m3\)/, `${COLUMNS.JEN.SEPTIC.CAPACITY}`);
    const data = d3Dsv.csvParse(cleanText);
    const obj = transformData({ data });
    const csv = transformObj({ obj });
    writeFile({ csv, csvWritePath });
  });
};
