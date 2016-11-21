const path = require('path');
const fs = require('fs');

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

module.exports = {
  getReadPath,
  getWritePath,
  writeFile,
};
