import { _checkAllGroupsHasCommonRows_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/checkcommonts";
import { _getReducedColumnValuesClusterCollection_ } from "@/tablers/columntypecluster/clusterstoschema/fitheaders/reducecollection";

import { expect, test } from "vitest";

/** @typedef {import("@/tablers/columntypecluster/clusterstoschema/fitheaders/fullclusterheadersinfo").SchemaValuesCluster} SchemaValuesCluster */

const possibleRowsCollection = [
  [
    [0, 1, 2, 3, 4, 5],
    [1, 2],
  ],
  [[3, 4, 5, 6], [0]],
  [
    [2, 3],
    [0, 1],
  ],
];

const test1 = _checkAllGroupsHasCommonRows_(
  [0, 1, 2, 3, 4, 5],
  0,
  possibleRowsCollection
);

test("Test having common row (3) = true", () => {
  expect(test1).toBe(true);
});

const test2 = _checkAllGroupsHasCommonRows_([1, 2], 0, possibleRowsCollection);

test("No common row (3) = false", () => {
  expect(test2).toBe(false);
});

/** @type {SchemaValuesCluster[][]} */
const collection = [
  [
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 1,
        end_index: 7,
        max_scale: 0,
        max_precision: 0,
        max_size: 28,
        indexes_null: [3, 4],
        column_index: 1,
        position: 0,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "product_id",
          message: "ok",
          original_value: "product id",
        },
        row_index: 5,
        column_index: 1,
      },
      possible_rows_start: [6, 5, 4, 3, 2, 1],
    },
    {
      cluster: {
        type: "string",
        string_like_type: "int",
        start_index: 8,
        end_index: 34,
        max_scale: 0,
        max_precision: 2,
        max_size: 2,
        indexes_null: [14, 22],
        column_index: 1,
        position: 1,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "product_id",
          message: "ok",
          original_value: "product id",
        },
        row_index: 5,
        column_index: 1,
      },
      possible_rows_start: [10, 9, 8],
    },
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 35,
        end_index: 36,
        max_scale: 0,
        max_precision: 0,
        max_size: 5,
        indexes_null: [],
        column_index: 1,
        position: 2,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "product_id",
          message: "ok",
          original_value: "product id",
        },
        row_index: 5,
        column_index: 1,
      },
      possible_rows_start: [35],
    },
    {
      cluster: {
        type: "datetime",
        start_index: 37,
        end_index: 37,
        max_scale: 0,
        max_precision: 0,
        max_size: 26,
        indexes_null: [],
        column_index: 1,
        position: 3,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "product_id",
          message: "ok",
          original_value: "product id",
        },
        row_index: 5,
        column_index: 1,
      },
      possible_rows_start: [38, 37],
    },
  ],
  [
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 5,
        end_index: 39,
        max_scale: 0,
        max_precision: 0,
        max_size: 13,
        indexes_null: [7, 14, 22, 35, 36, 37, 38],
        column_index: 2,
        position: 0,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "_1product_name",
          message: "ok",
          original_value: "1product name",
        },
        row_index: 5,
        column_index: 2,
      },
      possible_rows_start: [
        38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
        20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
      ],
    },
  ],
  [
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 1,
        end_index: 6,
        max_scale: 0,
        max_precision: 0,
        max_size: 15,
        indexes_null: [2, 3, 4],
        column_index: 3,
        position: 0,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "units_sold",
          message: "ok",
          original_value: "units sold",
        },
        row_index: 5,
        column_index: 3,
      },
      possible_rows_start: [5, 4, 3, 2, 1],
    },
    {
      cluster: {
        type: "string",
        string_like_type: "int",
        start_index: 8,
        end_index: 34,
        max_scale: 0,
        max_precision: 3,
        max_size: 3,
        indexes_null: [14, 22],
        column_index: 3,
        position: 1,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "units_sold",
          message: "ok",
          original_value: "units sold",
        },
        row_index: 5,
        column_index: 3,
      },
      possible_rows_start: [10, 9, 8, 7],
    },
  ],
  [
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 5,
        end_index: 6,
        max_scale: 0,
        max_precision: 0,
        max_size: 7,
        indexes_null: [],
        column_index: 5,
        position: 0,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "revenue",
          message: "ok",
          original_value: "revenue",
        },
        row_index: 5,
        column_index: 5,
      },
      possible_rows_start: [5, 4, 3, 2, 1],
    },
    {
      cluster: {
        type: "int",
        start_index: 7,
        end_index: 7,
        max_scale: 0,
        max_precision: 7,
        max_size: 7,
        indexes_null: [],
        column_index: 5,
        position: 1,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "revenue",
          message: "ok",
          original_value: "revenue",
        },
        row_index: 5,
        column_index: 5,
      },
      possible_rows_start: [9, 8, 7],
    },
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 8,
        end_index: 34,
        max_scale: 0,
        max_precision: 0,
        max_size: 5,
        indexes_null: [14, 22],
        column_index: 5,
        position: 2,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "revenue",
          message: "ok",
          original_value: "revenue",
        },
        row_index: 5,
        column_index: 5,
      },
      possible_rows_start: [
        33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16,
        15, 14, 13, 12, 11, 10, 9, 8,
      ],
    },
  ],
  [
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 5,
        end_index: 34,
        max_scale: 0,
        max_precision: 0,
        max_size: 11,
        indexes_null: [7, 14, 22],
        column_index: 6,
        position: 0,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "profit",
          message: "ok",
          original_value: "profit",
        },
        row_index: 5,
        column_index: 6,
      },
      possible_rows_start: [
        33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16,
        15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
      ],
    },
  ],
  [
    {
      cluster: {
        type: "string",
        string_like_type: "string",
        start_index: 5,
        end_index: 7,
        max_scale: 0,
        max_precision: 0,
        max_size: 8,
        indexes_null: [],
        column_index: 8,
        position: 0,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "date_",
          message: "ok",
          original_value: "date",
        },
        row_index: 5,
        column_index: 8,
      },
      possible_rows_start: [6, 5, 4, 3, 2, 1],
    },
    {
      cluster: {
        type: "string",
        string_like_type: "date",
        start_index: 8,
        end_index: 34,
        max_scale: 0,
        max_precision: 0,
        max_size: 10,
        indexes_null: [14, 22],
        column_index: 8,
        position: 1,
      },
      header: {
        header_response: {
          is_valid: true,
          suggested_value: "date_",
          message: "ok",
          original_value: "date",
        },
        row_index: 5,
        column_index: 8,
      },
      possible_rows_start: [10, 9, 8],
    },
  ],
];

const reduced = _getReducedColumnValuesClusterCollection_(collection);

console.log(JSON.stringify(reduced)); // f
