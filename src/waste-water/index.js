const CONSTANTS = require('./constants/resources.js');
const district1 = require('./acted/district-1.js');
const district34 = require('./jen/district-3-4.js');

district1({
  csvReadPath: CONSTANTS.ACTED.DISTRICT_1.READ,
  csvWritePath: CONSTANTS.ACTED.DISTRICT_1.WRITE,
});

district34({
  csvReadPath: CONSTANTS.JEN.DISTRICT_3_4.READ,
  csvWritePath: CONSTANTS.JEN.DISTRICT_3_4.WRITE,
});
