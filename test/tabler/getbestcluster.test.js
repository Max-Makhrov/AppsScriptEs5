import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { valueTableSamples } from "./tablesamples";
import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);

const res1 = findNextBestFitValuesCluster_(clustersMap);
const bestCluster1 = res1.best_cluster;

console.log(res1);

test(`Test best cluster is found`, () => {
  expect(bestCluster1).not.toBe(null);
});

const takenCluster = {
  ["" + bestCluster1.column_index]: [res1.best_cluster_index],
};
console.log(takenCluster);
const res2 = findNextBestFitValuesCluster_(clustersMap, takenCluster);
console.log(res2);
const bestCluster2 = res2.best_cluster;

test(`Do not find same bast if taken`, () => {
  expect(bestCluster2).not.toBe(null);
  expect(bestCluster1.column_index).not.toBe(bestCluster2.column_index);
});

takenCluster["" + bestCluster2.column_index] = [res2.best_cluster_index];
const res3 = findNextBestFitValuesCluster_(clustersMap, takenCluster);
const bestCluster3 = res3.best_cluster;
console.log(res3);

takenCluster["" + bestCluster3.column_index] = [res3.best_cluster_index];
const res4 = findNextBestFitValuesCluster_(clustersMap, takenCluster);
const bestCluster4 = res4.best_cluster;
console.log(res4);

takenCluster["" + bestCluster4.column_index] = [res4.best_cluster_index];
const res5 = findNextBestFitValuesCluster_(clustersMap, takenCluster);
const bestCluster5 = res5.best_cluster;
console.log(res5);

takenCluster["" + bestCluster5.column_index] = [res5.best_cluster_index];
const res6 = findNextBestFitValuesCluster_(clustersMap, takenCluster);
// const bestCluster6 = res6.best_cluster;
console.log(res6);
