const DISTRICT_1 = {
  NO: 'No.',
  SEPTIC: {
    DISTRICT_1: 'District Old',
    DISTRICT_2: 'District',
    BLOCK_1: 'Block ',
    BLOCK_2: 'Block',
    ID_1: 'Code-of-PRC-Tank-(new)',
    ID_2: 'Tank # (According to  new Numbering Method)',
    CAPACITY: 'Septic Capacity (m3)',
  },
  HOUSE: {
    ID: 'HH number  (address)',
  },
  STEEL: {
    ID: 'Code  of Steel Tank',
    CAPACITY: 'Capacity (m3)',
  },
};

const DISTRICT_2_9_11 = {
  NO: 'No.',
  SEPTIC: {
    DISTRICT_1: 'District Old',
    DISTRICT_2: 'District',
    BLOCK_1: 'Block Old',
    BLOCK_2: 'Block',
    ID_1: 'Code of PRC Tank (new)',
    ID_2: 'Tank # (According to  new Numbering Method)',
    CAPACITY: 'Septic Capacity (m3)',
  },
  HOUSE: {
    ID: 'HH number  (address)',
  },
  STEEL: {
    ID: 'Code  of Steel Tank',
    CAPACITY: 'Capacity (m3)',
  },
};

const DISTRICT_10 = {
  NO: 'No.',
  SEPTIC: {
    DISTRICT_1: 'District Old',
    DISTRICT_2: 'District',
    BLOCK_1: 'Block-',
    BLOCK_2: 'Block',
    ID_1: 'Code-of-PRC-Tank-(new)',
    ID_2: 'Tank-#-(According-to--new-Numbering-Method)',
    CAPACITY: 'Septic Capacity (m3)',
  },
  HOUSE: {
    ID: 'Individuals/HH',
  },
  STEEL: {
    ID: 'Code--of-Steel-Tank',
    CAPACITY: 'Capacity-(m3)',
  },
};

const DISTRICT_12 = {
  NO: 'No.',
  SEPTIC: {
    DISTRICT_1: 'District Old',
    DISTRICT_2: 'District',
    BLOCK_1: 'Block Old',
    BLOCK_2: 'Block',
    ID_1: 'Code of PRC Tank (new)',
    ID_2: 'Tank # (According to  new Numbering Method)',
    CAPACITY: 'Septic Capacity (m3)',
  },
  HOUSE: {
    ID: 'HH number  (address)/Block',
  },
  STEEL: {
    ID: '',
    CAPACITY: 'Capacity (m3)',
  },
};

module.exports = {
  ACTED: {
    1: DISTRICT_1,
    2: DISTRICT_2_9_11,
    9: DISTRICT_2_9_11,
    10: DISTRICT_10,
    11: DISTRICT_2_9_11,
    12: DISTRICT_12,
  },
  JEN: {
    DISTRICT_3_4: {
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
  },
};
