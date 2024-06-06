import { checkValuesIsvalidRectangle_ } from "@/tablers/checkisrectangle";
import { expect, test } from "vitest";

const falseCases = [
  false,
  true,
  null,
  undefined,
  100,
  "Hello",
  new Date(),
  {},
  [],
  [null],
  [undefined],
  [[]],
  [{}],
  [{ 0: 1 }],
  [{ 0: ["foo"] }],
  [[1], [1, 2]],
];

const trueCases = [
  [[1]],
  [[""]],
  [
    [1, 2, 3],
    [1, 2, 3],
    [4, 5, 6],
    ["a", "", new Date()],
  ],
  [[undefined]],
];

falseCases.forEach((value) => {
  test(`Returns false for this wrong inputs`, () => {
    const res = checkValuesIsvalidRectangle_(value);
    console.log(res.message);
    expect(res.is_valid).toBe(false);
  });
});

trueCases.forEach((value) => {
  test(`Returns false for this wrong inputs`, () => {
    const res = checkValuesIsvalidRectangle_(value);
    expect(res.is_valid).toBe(true);
  });
});
