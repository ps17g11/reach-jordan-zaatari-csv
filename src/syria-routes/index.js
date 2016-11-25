const fs = require('fs-extra');
const d3Dsv = require('d3-dsv');
const XLSX = require('xlsx');
const COLUMNS = require('./columns.js');

const inputPath = './data/syria-routes/input/input.xlsx';
const outputPath = './data/syria-routes/output';
const outputPathMultiPart = `${outputPath}/multi-part`;
const readmeText = '# Output files written to this directory\n';

fs.removeSync(outputPath);
fs.mkdirsSync(outputPath);
fs.writeFileSync(`${outputPath}/README.md`, readmeText);
fs.mkdirsSync(outputPathMultiPart);
fs.writeFileSync(`${outputPathMultiPart}/README.md`, readmeText);

const workbook = XLSX.readFile(inputPath);
const [sheet1] = workbook.SheetNames;
const originalCsv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet1]);
const data = d3Dsv.csvParse(originalCsv);

function filterNoData(row) {
  return row.length > Object.keys(COLUMNS.HEADERS).length + 2;
}

function mapRows(row) {
  return COLUMNS.ROUTES
    .map((route, index) => (
      [
        index + 1,
        ...Object.values(route).map((attribute) => row[attribute] || ''),
      ].join(',')
    ))
    .filter(filterNoData)
    .join('\n');
}

function writeRouteToFile(row) {
  const FGD = row[COLUMNS.HEADERS.FOCUS_GROUP];
  COLUMNS.ROUTES_SEPARATE_FILES.forEach((route, index) => {
    const fileName = `FGD_${FGD}_R${index + 1}`;
    const routePart = Object.values(route)
      .filter((attribute) => row[attribute])
      .map((attribute, order) => (
        [order + 1, row[attribute] || ''].join(',')
      ));
    const fileContent = [`Order,${fileName}`, ...routePart].join('\n');
    if (fileContent.length > 20) {

      fs.writeFile(
        `${outputPathMultiPart}/${fileName}.csv`, fileContent, (err) => {
          if (err) throw err;
        });
    }
  });
}

const csvData = data.map(mapRows).join('\n');
data.forEach(writeRouteToFile);

const headers = Object.values(COLUMNS.HEADERS).join(',');
const newCsv = `Route,${headers}\n${csvData}`;

fs.writeFile(`${outputPath}/output.csv`, newCsv, (err) => {
  if (err) throw err;
});
