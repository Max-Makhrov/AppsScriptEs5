import { getColumnValuesClusterPossibleRowsStart_ } from "@/tablers/columntypecluster/fits/getclusterpossiblerowsstart";

import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { valueTableSamples } from "./tablesamples";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";

import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);
const bestFit1 = findNextBestFitValuesCluster_(clustersMap);
const bestCluster1 = bestFit1.best_cluster;

const possibleRowsStart = getColumnValuesClusterPossibleRowsStart_(
  bestCluster1,
  testRectangle,
  1
);

const possibleRowsStart2 = getColumnValuesClusterPossibleRowsStart_(
  bestCluster1,
  testRectangle,
  3
);

const possibleRowsStart3 = getColumnValuesClusterPossibleRowsStart_(
  bestCluster1,
  testRectangle,
  0
);

const testCluster2 = clustersMap[6][1];

const possibleRowsStart4 = getColumnValuesClusterPossibleRowsStart_(
  testCluster2,
  testRectangle,
  3
);

test(`Column have possible rows to start from`, () => {
  expect(possibleRowsStart.length).not.toBe(0);
  expect(possibleRowsStart2.length).not.toBe(0);
  expect(possibleRowsStart3.length).not.toBe(0);
  expect(possibleRowsStart4.length).not.toBe(0);
});

console.log(possibleRowsStart);
console.log(possibleRowsStart2);
console.log(possibleRowsStart3);
console.log(bestCluster1);
// console.log(JSON.stringify(clustersMap));
console.log(possibleRowsStart4);
console.log(testCluster2);

const testCluster5 = clustersMap[1][0];
const possibleRowsStart5 = getColumnValuesClusterPossibleRowsStart_(
  testCluster5,
  testRectangle,
  0
);

console.log(possibleRowsStart5);

test(`String cluster from row 1 will not include wrong rows`, () => {
  expect(Math.max(...possibleRowsStart5)).toBe(testCluster5.end_index - 1);
  expect(Math.min(...possibleRowsStart5)).toBeGreaterThan(0);
});
