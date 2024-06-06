/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/**
 * Returns more than 1 if same number of headers
 *
 * @param {SheetColumnNamedClusterHeader[][][]} headerIslands
 *
 * @returns {SheetColumnNamedClusterHeader[][]}
 */
export function getBiggerClusterHeadersByIslands_(headerIslands) {
  const result = [];
  if (!headerIslands) return result;
  if (!headerIslands.length) return result;
  if (!headerIslands[0].length) return result;
  if (!headerIslands[0][0].length) return result;

  let maxLength = 0;
  let biggerIslands = [];
  headerIslands.forEach((rowGroup) =>
    rowGroup.forEach((island) => {
      if (island.length > maxLength) {
        biggerIslands = [island];
        maxLength = island.length;
      } else if (island.length === maxLength) {
        biggerIslands.push(island);
      }
    })
  );

  return biggerIslands;
}
