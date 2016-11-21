function parseSteelTank({ tankId }) {
  if (!tankId) return '';
  const parts = tankId.split('-');
  return `${parts[0]}-${Number(parts[1])}-${Number(parts[2])}`;
}

function replaceHeaders({ columns, district, text }) {
  let cleanText = text;
  cleanText = cleanText.replace(columns.SEPTIC.DISTRICT, columns.SEPTIC.DISTRICT_OLD);
  if (district === 10) {
    cleanText = cleanText.replace(columns.SEPTIC.BLOCK, columns.SEPTIC.BLOCK_OLD);
  }
  cleanText = cleanText.replace(columns.STEEL.CAPACITY, columns.SEPTIC.CAPACITY);
  return cleanText;
}

module.exports = {
  parseSteelTank,
  replaceHeaders,
};
