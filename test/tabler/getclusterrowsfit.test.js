import { check2ClustersRowsFit_ } from "@/tablers/columntypecluster/fits/checkclustersrowfit";
import { getInitialFitColumnValuesClustersInfo_ } from "@/tablers/columntypecluster/fits/getfitclustersoptions";

import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { valueTableSamples } from "./tablesamples";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";

import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);
const bestFit1 = findNextBestFitValuesCluster_(clustersMap);
const bestCluster1 = bestFit1.best_cluster;

const info = getInitialFitColumnValuesClustersInfo_(
  bestCluster1,
  testRectangle,
  clustersMap
);

const res1 = check2ClustersRowsFit_(info, clustersMap[0][0]);

console.log("👀👀👀");
console.log(JSON.stringify(clustersMap[0][0]));

test(`Check possible rows start fit`, () => {
  expect(res1.fits).toBe(false);
});

const res2 = check2ClustersRowsFit_(info, clustersMap[1][0]);

console.log(bestCluster1);
console.log(res2);

test(`Check possible rows start not fit`, () => {
  expect(res2.fits).toBe(false);
});

const res3 = check2ClustersRowsFit_(info, clustersMap[2][2]);

console.log(bestCluster1);
console.log(res3);
