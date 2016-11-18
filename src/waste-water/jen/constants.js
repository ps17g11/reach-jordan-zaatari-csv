const path = require('path');

module.exports = {
  COLUMNS: {
    SEPTIC: {
      DISTRICT: 'District',
      BLOCK: 'Block',
      NUMBER: 'Tank # (According to  new Numbering Method)',
      CAPACITY: 'Septic Capacity (m3)',
    },
    HOUSE: {
      DISTRICT: 'HH number (district)',
      BLOCK: 'HH number (block)',
      NUMBER: 'HH number (house)',
    },
    STEEL: {
      ID: 'Code  of Steel Tank',
      CAPACITY: 'Capacity (m3)',
    },
  },
  PATHS: {
    READ: path.resolve('./data/waste-water/input/jen/district-3-4.csv'),
    WRITE: {
      ERRORS: path.resolve('./data/waste-water/output/jen/errors/district-3-4.csv'),
      MAPPED: path.resolve('./data/waste-water/output/jen/mapped/district-3-4.csv'),
      NORMALIZED: path.resolve('./data/waste-water/output/jen/normalized/district-3-4.csv'),
    },
  },
  REGEX: {
    FIRST_FOUR_LINES: /^(?:.*\r?\n?){4}/,
  },
};
