import { expect, test } from "vitest";
import { getValuesheaderHeadersRangeGrids_ } from "@/tablers/columntypecluster/grids/headergrids";
import { getRangeGridByRangeA1_ } from "@/rangers/converters/grid_to_range";

const headers = [
  {
    column_index: 2,
    database_value: "product_id",
    original_value: "product id",
    row_index: 5,
    is_generic: false,
  },
  {
    column_index: 3,
    database_value: "_1product_name",
    original_value: "1product name",
    row_index: 5,
    is_generic: false,
  },
  {
    column_index: 4,
    database_value: "units_sold",
    original_value: "units sold",
    row_index: 5,
    is_generic: false,
  },
  {
    column_index: 6,
    database_value: "revenue",
    original_value: "*revenue",
    row_index: 5,
    is_generic: false,
  },
  {
    column_index: 7,
    database_value: "profit",
    original_value: "profit",
    row_index: 5,
    is_generic: false,
  },
  {
    column_index: 9,
    database_value: "date_",
    original_value: "date",
    row_index: 5,
    is_generic: false,
  },
];

const res = getValuesheaderHeadersRangeGrids_(headers);

const a1 = res.map(getRangeGridByRangeA1_);

console.log(JSON.stringify(res));
console.log(JSON.stringify(a1));

test("Dummy", () => {
  expect(1).toBe(1);
});
