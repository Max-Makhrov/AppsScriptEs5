import { check2ClustersFirstRowsEdgeCases_ } from "@/tablers/columntypecluster/fits/checkclustersrowsmatch";

import { valueTableSamples } from "./tablesamples";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";

import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);

const cluster1 = clustersMap[11][0];
const cluster2 = clustersMap[9][1];

const result1 = check2ClustersFirstRowsEdgeCases_(cluster1, cluster2);
const result2 = check2ClustersFirstRowsEdgeCases_(cluster2, cluster1);

test(`Expect some result from edge case check`, () => {
  expect(result1).not.toBe(null);
  expect(result2).not.toBe(null);
});

test(`Expect edge cases to be found`, () => {
  expect(result1.mismatch).toBe(true);
  expect(result2.mismatch).toBe(true);
});

console.log(result1);
console.log(result2);
const fitCluster = clustersMap[7][0];

const result3 = check2ClustersFirstRowsEdgeCases_(cluster2, fitCluster);
const result4 = check2ClustersFirstRowsEdgeCases_(fitCluster, cluster2);

test(`Expect edge cases NOT to be found`, () => {
  expect(result3.mismatch).toBe(false);
  expect(result4.mismatch).toBe(false);
});
