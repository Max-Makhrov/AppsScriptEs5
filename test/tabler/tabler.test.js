import { Tabler_ } from "@/talbler";
import { valueTableSamples } from "./tablesamples";

import { expect, test } from "vitest";

const te = new Tabler_(valueTableSamples.MyMy);

const res = te.getSchema();
console.log("hi!");
console.log(JSON.stringify(res));

const t = new Tabler_([["boo"]]);
console.log(t.getSchema());

const t0 = new Tabler_(valueTableSamples.err1);
console.log(t0.getSchema());
const t1 = new Tabler_(valueTableSamples.err2);
console.log(t1.getSchema());
const t2 = new Tabler_(valueTableSamples.err3);
console.log(t2.getSchema());

test("Dummy", () => {
  expect(0).toBe(0);
});
