import { getCommonColumnValuesClustersMissingColumns_ } from "@/tablers/columntypecluster/fits/commonmissingrows";

import { describe, it, expect } from "vitest";

describe("getCommonColumnValuesClustersMissingColumns_", () => {
  it("should return common values from the arrays", () => {
    const input = [
      [0, 2, 3],
      [2, 3],
      [1, 3, 5],
    ];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([3]);
  });

  it("should return an empty array if there are no common values", () => {
    const input = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([]);
  });

  it("should return all values if there is only one array", () => {
    const input = [[0, 1, 2]];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([0, 1, 2]);
  });

  it("should return an empty array if the input is an empty array", () => {
    const input = [];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([]);
  });

  it("should handle arrays with duplicate values correctly", () => {
    const input = [
      [1, 2, 2],
      [2, 3, 2],
      [2, 2, 4],
    ];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([2, 2]);
  });

  it("should handle arrays with negative values correctly", () => {
    const input = [
      [-1, -2, 3],
      [-2, 3, 4],
      [-2, 3, 5],
    ];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([-2, 3]);
  });

  it("should handle arrays with all identical values", () => {
    const input = [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ];
    const result = getCommonColumnValuesClustersMissingColumns_(input);
    expect(result).toEqual([1, 2, 3]);
  });
});
