const { mapRowsByTank, parseId, sortRows } = require('./clean.js');
const { getReadPath, getWritePath, writeFile } = require('./file-system.js');
const { testData } = require('./test.js');
const { mappedToCSV, normalizedToCSV } = require('./to-csv.js');

module.exports = {
  getReadPath,
  getWritePath,
  writeFile,
  mapRowsByTank,
  mappedToCSV,
  normalizedToCSV,
  parseId,
  sortRows,
  testData,
};
