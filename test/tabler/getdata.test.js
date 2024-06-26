import { expect, test } from "vitest";
import { valueTableSamples } from "./tablesamples";
import { Tabler_ } from "@/talbler";

const values = valueTableSamples.Boo;

const t = new Tabler_(values);

const vals = t.getData();

console.log(vals);

test("Test tabler returns correct valuees", () => {
  expect(vals.length).toBe(26);
});
