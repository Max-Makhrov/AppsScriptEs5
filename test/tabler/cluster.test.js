import { ColumnClusterType_ } from "@/tablers/columntypecluster/cluster";
import { expect, test } from "vitest";

/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */

/** @type {TypeCheckResult} */
const testType = {
  type: "string",
  string_like_type: "number",
  precision: 4,
  scale: 2,
};

const Cluster = new ColumnClusterType_(testType, 0, 1);

const iCluster0 = Cluster.getInfo();

console.log(iCluster0);

test(`Basic cluster info is correct`, () => {
  expect(iCluster0.start_index).toBe(0);
  expect(iCluster0.end_index).toBe(0);
  expect(iCluster0.indexes_null.length).toBe(0);
  expect(iCluster0.max_precision).toBe(testType.precision);
  expect(iCluster0.max_scale).toBe(testType.scale);
  expect(iCluster0.max_size).toBe(0);
  expect(iCluster0.type).toBe(testType.type);
  expect(iCluster0.string_like_type).toBe(testType.string_like_type);
  expect(iCluster0.column_index).toBe(1);
});

/** @type {TypeCheckResult} */
const nullType = {
  type: "string",
  string_like_type: "null",
};

const numNulls0 = 13;

const Cluster1 = new ColumnClusterType_(testType, 0);
for (let i = 0; i < numNulls0; i++) {
  Cluster1.addItem(nullType, true);
}

const iCluster1 = Cluster1.getInfo();
test(`Null types are added correctly`, () => {
  expect(iCluster1.start_index).toBe(0);
  expect(iCluster1.end_index).toBe(0);
  expect(iCluster1.indexes_null.length).toBe(0);
  expect(iCluster1.max_precision).toBe(testType.precision);
  expect(iCluster1.max_scale).toBe(testType.scale);
  expect(iCluster1.max_size).toBe(0);
  expect(iCluster1.type).toBe(testType.type);
  expect(iCluster1.string_like_type).toBe(testType.string_like_type);
});

const startingIndex2 = 115;
const Cluster2 = new ColumnClusterType_(testType, startingIndex2);
for (let i = 0; i < numNulls0; i++) {
  Cluster2.addItem(nullType, true);
}
const numAdd2 = 23;
/** @type {TypeCheckResult} */
const nextType = {
  type: "string",
  string_like_type: "number",
  precision: 5,
  scale: 3,
  size: 500,
};
for (let i = 0; i < numAdd2; i++) {
  Cluster2.addItem(nextType);
}

const iCluster2 = Cluster2.getInfo();

test(`Null and other types are added correctly + scale++`, () => {
  expect(iCluster2.start_index).toBe(startingIndex2);
  expect(iCluster2.end_index).toBe(startingIndex2 + numNulls0 + numAdd2);
  expect(iCluster2.indexes_null.length).toBe(numNulls0);
  expect(iCluster2.max_precision).toBe(nextType.precision);
  expect(iCluster2.max_scale).toBe(nextType.scale);
  expect(iCluster2.max_size).toBe(nextType.size);
  expect(iCluster2.type).toBe(testType.type);
  expect(iCluster2.string_like_type).toBe(testType.string_like_type);
});
