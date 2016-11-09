module.exports = {
  FIRST_LINE: /^.*\r?\n?/,
  FIRST_FOUR_LINES: /^(?:.*\r?\n?){4}/,
  SEPTIC_ID: /^D[1-9][0-2]?-B[1-9][0-9]?-T[1-9][0-9]?/,
  HOUSEHOLD_ID: /^D[1-9][0-2]?-B[1-9][0-9]?-H(?:[1-9][0-9]?|[1-2][0-9][0-9])?(?:[a-f]|-[1-9])?$/,
  DISTRICT: /^D([1-9][0-2]?)-B/,
  BLOCK: /-B([1-9][0-9]?)-[HT]/,
  NUMBER: /[0-9]+/,
};
