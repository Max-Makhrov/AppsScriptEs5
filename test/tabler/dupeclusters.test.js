import { valueTableSamples } from "./tablesamples";

import { expect, test } from "vitest";
import { getAllFitClustersInfo_ } from "@/tablers/columntypecluster/getallfitclusters";

const values = valueTableSamples.err6;

const matchFit = getAllFitClustersInfo_(values);
const clusters = matchFit.clusters;

const dupes = [];
const keyd = {};
clusters.forEach((c) => {
  const k = "" + c.column_index;
  if (keyd[k]) dupes.push(c);
  keyd[k] = true;
});

test("No duped clusters in the result!", () => {
  expect(dupes.length).toBe(0);
});
