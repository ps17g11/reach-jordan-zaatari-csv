const RESOURCES = require('./constants/resources.js');
const unhcr = require('./scripts/unhcr.js');

unhcr({
  csvReadPath: RESOURCES.READ,
  csvWritePath: RESOURCES.WRITE,
});
