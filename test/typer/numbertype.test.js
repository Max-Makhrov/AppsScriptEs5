import { getBasicNumberType_ } from "@/typers/getnumbertype";

import { expect, test } from "vitest";

const intCases = [10, 20, 99999, 0, -500, 500.0];
const intPrecisions = [2, 2, 5, 1, 3, 3];

const numberCases = [10.1, 1.00000001, 10.999, -5682.555];
const numberPrecisions = [3, 9, 5, 7];
const numberScales = [1, 8, 3, 3];

intCases.forEach((value, i) => {
  test(`Number should be int`, () => {
    const res = getBasicNumberType_(value);
    expect(res.type).toBe("int");
    expect(res.precision).toBe(intPrecisions[i]);
    expect(res.scale).toBe(0);
  });
});
numberCases.forEach((value, i) => {
  test(`Number should be "number"`, () => {
    const res = getBasicNumberType_(value);
    expect(res.type).toBe("number");
    expect(res.precision).toBe(numberPrecisions[i]);
    expect(res.scale).toBe(numberScales[i]);
  });
});
