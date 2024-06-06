import { mergeColumnValuesClusters_ } from "@/tablers/columntypecluster/clusterstoschema/mergeclusters";

import { valueTableSamples } from "./tablesamples";
import { getAllValuesClusters_ } from "@/tablers/columntypecluster/getvaluesclusters";

import { expect, test } from "vitest";

const testRectangle = valueTableSamples.MyMy;
const clustersMap = getAllValuesClusters_(testRectangle);

const cl1 = clustersMap[2][0];
const cl2 = clustersMap[2][1];
const res1 = mergeColumnValuesClusters_([cl1, cl2]);

test("2 clusters meet = start-end indexes", () => {
  expect(res1.start_index).toBe(cl1.start_index);
  expect(res1.end_index).toBe(cl2.end_index);
});
test("2 clusters meet = null indexes", () => {
  const nullInds = cl1.indexes_null.concat(cl2.indexes_null);
  expect(res1.indexes_null).toEqual(nullInds);
});

const cl3 = clustersMap[2][2];
const res2 = mergeColumnValuesClusters_([cl1, cl2, cl3]);

test("3 clusters meet = start-end indexes", () => {
  expect(res2.start_index).toBe(cl1.start_index);
  expect(res2.end_index).toBe(cl3.end_index);
});

test("3 clusters meet = null indexes", () => {
  const nullInds = cl1.indexes_null
    .concat(cl2.indexes_null)
    .concat(cl3.indexes_null);
  expect(res2.indexes_null).toEqual(nullInds);
});

console.log(JSON.stringify(clustersMap)); //
