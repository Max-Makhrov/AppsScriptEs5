import { expect, test } from "vitest";

import { valueTableSamples } from "./tablesamples";
import { getTheFirstSheetSchema_ } from "@/tablers/getSchema";

const values = valueTableSamples.err4;

const schama = getTheFirstSheetSchema_(values);

test("Expect last row to be not broken", () => {
  expect(schama.row_data_ends).toBe(8);
});

const v2 = valueTableSamples.MyMy;
const s2 = getTheFirstSheetSchema_(v2);
console.log(JSON.stringify(s2)); //

test("Expect last row for MyMy to be cropped", () => {
  expect(s2.row_data_ends).toBe(34);
});
