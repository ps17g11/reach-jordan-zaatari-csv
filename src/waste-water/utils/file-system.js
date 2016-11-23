const fs = require('fs');

function getWritePath({ district, partner, type }) {
  return `./data/waste-water/output/${partner}/${type}/district-${district}.csv`;
}

function writeFile({ csv, writePath }) {
  fs.writeFile(writePath, csv, (err) => {
    if (err) throw err;
  });
}

module.exports = {
  getWritePath,
  writeFile,
};
