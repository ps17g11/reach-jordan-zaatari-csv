const jen = require('./jen.js');
const CONSTANTS = require('./constants/resources.js');

jen({
  csvReadPath: CONSTANTS.JEN.READ,
  csvWritePath: CONSTANTS.JEN.WRITE,
});
