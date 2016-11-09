const fs = require('fs');
const d3Dsv = require('d3-dsv');
const COLUMNS = require('../constants/columns.js');
const REGEX = require('../constants/regex.js');

function writeFile({ csv, csvWritePath }) {
  fs.writeFile(csvWritePath, csv, (err) => {
    if (err) throw err;
  });
}

function transformData({ data }) {
  const obj = {};
  for (const row of data) {
    const caseIds = row[COLUMNS.CASE_ID];
    if (caseIds && caseIds.toLowerCase() !== 'unoccupied') {
      const caseIdArray = caseIds.split(/[,;.'P\s\\\/]+/);
      for (const caseIdRaw of caseIdArray) {
        if (caseIdRaw && caseIdRaw.length < 24) {
          const caseId = caseIdRaw.toUpperCase();
          obj[caseId] = obj[caseId] || {};
          obj[caseId].district = row[COLUMNS.DISTRICT];
          obj[caseId].addressEn = row[COLUMNS.ADDRESS_EN];
          obj[caseId].addressAr = row[COLUMNS.ADDRESS_AR];
          obj[caseId].remarks = row[COLUMNS.REMARKS];
          obj[caseId].positionX = row[COLUMNS.POSITION_X];
          obj[caseId].positionY = row[COLUMNS.POSITION_Y];
        } else if (caseIdRaw) {
          const caseIdDuplicateArray = caseIdRaw.match(/.{1,12}/g);
          for (const caseIdDuplicateRaw of caseIdDuplicateArray) {
            const caseId = caseIdDuplicateRaw.toUpperCase();
            obj[caseId] = obj[caseId] || {};
            obj[caseId].district = row[COLUMNS.DISTRICT];
            obj[caseId].addressEn = row[COLUMNS.ADDRESS_EN];
            obj[caseId].addressAr = row[COLUMNS.ADDRESS_AR];
            obj[caseId].remarks = row[COLUMNS.REMARKS];
            obj[caseId].positionX = row[COLUMNS.POSITION_X];
            obj[caseId].positionY = row[COLUMNS.POSITION_Y];
          }
        }
      }
    }
  }
  return obj;
}

function transformObj({ obj }) {
  let csv = 'caseID,district,addressEn,addressAr,remarks,positionX,positionY\n';
  for (const [key, value] of Object.entries(obj)) {
    csv += `${key},${value.district},${value.addressEn},${value.addressAr},${value.remarks},${value.positionX},${value.positionY}\n`;
  }
  return csv;
}

module.exports = ({ csvReadPath, csvWritePath }) => {
  fs.readFile(csvReadPath, 'utf8', (err, rawText) => {
    if (err) throw err;
    const match = rawText.match(REGEX.FIRST_SEVEN_LINES);
    const cleanText = rawText.substring(match[0].length);
    const data = d3Dsv.csvParse(cleanText);
    const obj = transformData({ data });
    const csv = transformObj({ obj });
    writeFile({ csv, csvWritePath });
  });
};
