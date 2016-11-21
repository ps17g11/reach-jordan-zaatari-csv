const d3Dsv = require('d3-dsv');
const utils = require('./index.js');

module.exports = ({ columns, district, header, partner, partnerUtils, rawText }) => {
  const match = rawText.match(header);
  const concatText = rawText.substring(match[0].length);
  const cleanText = partnerUtils.replaceHeaders({ columns, district, text: concatText });
  const data = d3Dsv.csvParse(cleanText);
  const normalizedData = partnerUtils.normalizeData({ columns, data, district });
  const normalizedCSV = utils.normalizedToCSV({ rows: normalizedData });
  const mappedObj = normalizedData.reduce(utils.mapRowsByTank, {});
  const mappedCSV = utils.mappedToCSV({ obj: mappedObj });
  const writePathNormalized = utils.getWritePath({ district, partner, type: 'normalized' });
  const writePathMapped = utils.getWritePath({ district, partner, type: 'mapped' });
  utils.writeFile({ csv: normalizedCSV, writePath: writePathNormalized });
  utils.writeFile({ csv: mappedCSV, writePath: writePathMapped });
};
