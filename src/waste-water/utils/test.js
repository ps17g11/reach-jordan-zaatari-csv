function testData({ row, normalizedRow }) {
  const values = Object.values(normalizedRow);
  if (values.some((number) => Number.isNaN(number))) {
    console.log(row);
    console.log(normalizedRow);
    throw new Error(row['No.']);
  }
}

module.exports = {
  testData,
};
