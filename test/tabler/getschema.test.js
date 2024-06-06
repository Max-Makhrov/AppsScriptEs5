import { expect, test } from "vitest";

import { getTheFirstSheetSchema_ } from "@/tablers/getSchema";
import { valueTableSamples } from "./tablesamples";

const res = getTheFirstSheetSchema_(valueTableSamples.MyMy);
console.log(JSON.stringify(res));

test("Dummy", () => {
  expect(1).toBe(1);
});
