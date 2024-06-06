import { getPossibleColumnClusterHeaders_ } from "@/tablers/columntypecluster/getclusterheaders";
import { findNextBestFitValuesCluster_ } from "@/tablers/columntypecluster/getnextbestcluster";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { valueTableSamples } from "./tablesamples";
import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);

const bestFit1 = findNextBestFitValuesCluster_(clustersMap);
const bestCluster1 = bestFit1.best_cluster;

console.log(bestCluster1);

const possibleHeaders1 = getPossibleColumnClusterHeaders_(
  testRectangle,
  bestCluster1
);

test(`Do not find same bast if taken`, () => {
  expect(possibleHeaders1.length).not.toBe(0);
});

// console.log(JSON.stringify(possibleHeaders1));

const stringHeaders = getPossibleColumnClusterHeaders_(
  testRectangle,
  clustersMap[1][0]
);

console.log(JSON.stringify(stringHeaders));
