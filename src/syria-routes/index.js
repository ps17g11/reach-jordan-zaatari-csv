const fs = require('fs');
const d3Dsv = require('d3-dsv');
const XLSX = require('xlsx');
const COLUMNS = require('./columns.js');

const inputPath = './data/syria-routes/input/input.xlsx';
const outputPath = './data/syria-routes/output/output.csv';

const workbook = XLSX.readFile(inputPath);
const [sheet1] = workbook.SheetNames;
const originalCsv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet1]);
const data = d3Dsv.csvParse(originalCsv);

const csvData = data.map((row) => (
  COLUMNS.ROUTES
    .map((route, index) => (
      [index + 1, Object.values(route).map((attribute) => row[attribute] || '')].join(',')
    ))
    .filter((subRow) => subRow.length > Object.keys(COLUMNS.HEADERS).length + 2)
    .join('\n')
)).join('\n');

const headers = Object.values(COLUMNS.HEADERS).join(',');
const newCsv = `Route,${headers}\n${csvData}`;

fs.writeFile(outputPath, newCsv, (err) => {
  if (err) throw err;
});
