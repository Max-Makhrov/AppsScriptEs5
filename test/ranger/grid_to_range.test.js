import { describe, it, expect } from "vitest";
import { getRangeGridByRangeA1_ } from "@/rangers/converters/grid_to_range";

describe("getRangeGridByRangeA1_", () => {
  it("should throw an error if grid is not provided", () => {
    expect(() => getRangeGridByRangeA1_(null)).toThrow(
      "Grid is required parameter for getting A1-Range"
    );
  });

  it("should return the correct A1 notation for a single cell range", () => {
    const grid = { startRowIndex: 0, startColumnIndex: 0 };
    expect(getRangeGridByRangeA1_(grid)).toBe("A1");
  });

  it("should return the correct A1 notation for a range involving multiple rows and columns", () => {
    const grid = {
      startRowIndex: 0,
      endRowIndex: 2,
      startColumnIndex: 0,
      endColumnIndex: 2,
    };
    expect(getRangeGridByRangeA1_(grid)).toBe("A1:B2");
  });
  it("bigger columns", () => {
    const grid = {
      startRowIndex: 0,
      endRowIndex: 2,
      startColumnIndex: 52,
      endColumnIndex: 65,
    };
    expect(getRangeGridByRangeA1_(grid)).toBe("BA1:BM2");
  });

  it("should handle undefined endRowIndex and endColumnIndex by defaulting to one more than the start", () => {
    const grid = { startRowIndex: 1, startColumnIndex: 1 };
    expect(getRangeGridByRangeA1_(grid)).toBe("B2");
  });

  // Add more test cases as needed
});
