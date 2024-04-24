import { validateRangeA1Notation_ } from "../src/validators/validate_a1";
import { expect, test } from "vitest";

const validRanges = [
  "A1",
  "A1:B3",
  "B3:A1",
  "A1:A",
  "A3:A",
  "A1:2",
  "A4:A",
  "A:B",
  "B:A",
  "AA:ZZ",
  "1:2",
  "2:1",
  "2:G5",
  "22:258",
  "$A1",
  "$A$1",
  "A$1",
  "$A$1:$B$1",
  "Z1:AA",
  "a1:b2",
  "Aa:Ak6",
];

const invalidRanges = [
  true,
  new Date(),
  null,
  "Hello",
  "H 1",
  "%33_",
  "33A",
  "1A:2B",
  "A:2$B",
  "1$A:B",
  "A:2B",
  "A$$2:B3",
  "A1:B2:C3",
  "A1:B22$22",
  "A1:B$B",
  "A1::B3",
  "A1:",
  ":",
  15,
  "A",
  "a",
  ":A1",
  "$",
  1 / 0,
  "15",
  "A1$:A2",
  "A1:A2$",
  "a:1",
  "a:65",
  "xx:1",
  "a:$1",
  "$a:1",
  "11:a",
];

validRanges.forEach((range) => {
  test(`Return true for valid range ${range}`, () => {
    const result = validateRangeA1Notation_(range);
    expect(result.is_valid).toBe(true);
  });
});

invalidRanges.forEach((range) => {
  test(`Return false for invalid range ${JSON.stringify(range)}`, () => {
    // @ts-ignore
    const result = validateRangeA1Notation_(range);
    expect(result.is_valid).toBe(false);
    if (!result.is_valid) {
      expect(result.message).not.toBe("ok");
    }
  });
});
