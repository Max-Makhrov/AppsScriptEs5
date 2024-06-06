import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";
import { valueTableSamples } from "./tablesamples";
import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;

const clustersMap = getAllValuesClusters_(testRectangle);

console.log(JSON.stringify(clustersMap, null, 2)); //
test(`Test cluster lenght 1`, () => {
  const res = clustersMap[0];
  expect(res.length).toBe(1);
});

test(`Test cluster with numbers from row 1 is skipped`, () => {
  const res = clustersMap[13];
  expect(res.length).toBe(0);
});
