import { test, expect } from "vitest";

import { valueTableSamples } from "./tablesamples";
import { Tabler_ } from "@/talbler";

test("MyMy gives 6 columns of result", () => {
  const t = new Tabler_(valueTableSamples.MyMy);
  const res = t.getSchema();
  expect(res.fields.length).toBe(6); // g
});
