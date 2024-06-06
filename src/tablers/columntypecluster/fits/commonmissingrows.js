/**
 * @param {Number[][]} missingColumnsMap
 * @returns {Number[]} common
 */
export function getCommonColumnValuesClustersMissingColumns_(
  missingColumnsMap
) {
  if (missingColumnsMap.length === 0) return [];

  let common = missingColumnsMap[0];

  for (let i = 1; i < missingColumnsMap.length; i++) {
    common = common.filter((value) => missingColumnsMap[i].includes(value));
  }

  return common;
}
