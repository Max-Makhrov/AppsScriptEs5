import { getAllFitClustersInfo_ } from "@/tablers/columntypecluster/getallfitclusters";
import { valueTableSamples } from "./tablesamples";

import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const bestFullInfo = getAllFitClustersInfo_(testRectangle);

test(`Find best clusters full info from data`, () => {
  expect(bestFullInfo.clusters.length).toBeGreaterThan(0);
});

console.log(JSON.stringify(bestFullInfo)); //
