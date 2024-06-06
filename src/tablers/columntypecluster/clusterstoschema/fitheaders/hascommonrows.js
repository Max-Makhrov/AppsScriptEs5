/**
 * @param {Number[]} rs1
 * @param {Number[]} rs2
 * @returns {Boolean}
 */
export function _checkTwoRowArraysHasCommonRows_(rs1, rs2) {
  for (let index = 0; index < rs1.length; index++) {
    const element = rs1[index];
    if (rs2.indexOf(element) > -1) return true;
  }
  return false;
}
