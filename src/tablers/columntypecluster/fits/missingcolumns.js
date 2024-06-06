/**
 * @param {Number[]} columns
 * @returns {Number[]}
 */
export function getDataValuesClustersMissingColumns_(columns) {
  if (columns.length === 0) {
    return [];
  }

  let min = columns[0];
  let max = columns[0];

  // Single loop to find min and max
  for (const num of columns) {
    if (num < min) min = num;
    if (num > max) max = num;
  }

  // Create a boolean array to mark the existence of numbers in the range [min, max]
  const rangeLength = max - min + 1;
  const isPresent = new Array(rangeLength).fill(false);

  // Marking the presence of each number from the columns array
  for (const num of columns) {
    isPresent[num - min] = true;
  }

  const missingIndexes = [];

  // Finding the missing indexes
  for (let i = 0; i < rangeLength; i++) {
    if (!isPresent[i]) {
      missingIndexes.push(i + min);
    }
  }

  return missingIndexes;
}
