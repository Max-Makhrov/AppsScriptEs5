import { describe, it, expect } from "vitest";
import { getDataValuesClustersMissingColumns_ } from "@/tablers/columntypecluster/fits/missingcolumns";

describe("getDataValuesClustersMissingColumns_", () => {
  it("should return missing indexes from the sample input", () => {
    const input = [1, 0, 3, 5, 8];
    const expectedOutput = [2, 4, 6, 7];
    expect(getDataValuesClustersMissingColumns_(input)).toEqual(expectedOutput);
  });

  it("should return an empty array when no indexes are missing", () => {
    const input = [0, 1, 2, 3, 4, 5];
    const expectedOutput = [];
    expect(getDataValuesClustersMissingColumns_(input)).toEqual(expectedOutput);
  });

  it("should handle an input array with negative numbers", () => {
    const input = [-3, -1, 0, 1];
    const expectedOutput = [-2];
    expect(getDataValuesClustersMissingColumns_(input)).toEqual(expectedOutput);
  });

  it("should handle an input array with a single element", () => {
    const input = [5];
    const expectedOutput = [];
    expect(getDataValuesClustersMissingColumns_(input)).toEqual(expectedOutput);
  });

  it("should handle an empty input array", () => {
    const input = [];
    const expectedOutput = [];
    expect(getDataValuesClustersMissingColumns_(input)).toEqual(expectedOutput);
  });

  it("should handle duplicate numbers in the input array", () => {
    const input = [1, 2, 2, 4, 4, 6];
    const expectedOutput = [3, 5];
    expect(getDataValuesClustersMissingColumns_(input)).toEqual(expectedOutput);
  });
});
