function parseHouseholdNumber({ number }) {
  return Number(number) || number.trim();
}

function parseSteelTank({ tankId }) {
  if (!tankId) return '';
  const parts = tankId.split('-');
  return `${parts[0]}-${Number(parts[1])}-${Number(parts[2])}`;
}

module.exports = {
  parseHouseholdNumber,
  parseSteelTank,
};
