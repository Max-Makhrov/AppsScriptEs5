import { getMergeCommonDataTypesType_ } from "@/typers/typesmergetype";
import { expect, test } from "vitest";

/** @typedef {import("@/typers/gettype").TypeCheckResult} TypeCheckResult */

/** @type {TypeCheckResult} */
const stringType = {
  size: 5,
  type: "string",
  string_like_type: "string",
};
/** @type {TypeCheckResult} */
const stringTypeBiggerSize = {
  size: 15,
  type: "string",
  string_like_type: "string",
};
/** @type {TypeCheckResult} */
const numType = {
  type: "number",
  size: 8,
  precision: 20,
  scale: 12,
};
/** @type {TypeCheckResult} */
const numTypeBiggerSize = {
  type: "number",
  size: 18,
  precision: 25,
  scale: 2,
};
/** @type {TypeCheckResult} */
const stringLikeNum = {
  type: "string",
  string_like_type: "number",
  size: 5,
  precision: 5,
  scale: 1002,
};
/** @type {TypeCheckResult} */
const dateType = {
  type: "date",
  size: 5,
};
/** @type {TypeCheckResult} */
const stringLikeDateType = {
  type: "string",
  string_like_type: "date",
  size: 5,
};

test(`String + String = String`, () => {
  const res = getMergeCommonDataTypesType_([stringType]);
  expect(res.string_like_type).toEqual(stringType.type);
  const res2 = getMergeCommonDataTypesType_([stringType, stringType]);
  expect(res2.string_like_type).toEqual(stringType.type);
  const res3 = getMergeCommonDataTypesType_([
    stringType,
    stringType,
    stringType,
  ]);
  expect(res3.string_like_type).toEqual(stringType.type);
  expect(res.size).toBe(res3.size);
  expect(res.size).toBe(stringType.size);
});

test("String size grows", () => {
  const res = getMergeCommonDataTypesType_([stringType, stringTypeBiggerSize]);
  expect(res.string_like_type).toEqual("string");
  expect(res.size).toBe(stringTypeBiggerSize.size);
});

test("String + Number = String", () => {
  const res = getMergeCommonDataTypesType_([stringType, numType]);
  expect(res.type).toBe("string");
  expect(res.string_like_type).toBe("string");
  expect(res.size).toBe(numType.size);
  const res2 = getMergeCommonDataTypesType_([stringTypeBiggerSize, numType]);
  expect(res2.string_like_type).toBe("string");
  expect(res2.size).toBe(stringTypeBiggerSize.size);
  expect(res2.type).toBe("string");
});

test(`Number + Number = Number`, () => {
  const res = getMergeCommonDataTypesType_([numType]);
  expect(res.type).toEqual(numType.type);
  const res2 = getMergeCommonDataTypesType_([numType, numType]);
  expect(res2.type).toEqual(numType.type);
  const res3 = getMergeCommonDataTypesType_([numType, numType, numType]);
  expect(res3.type).toEqual(numType.type);
  expect(res.size).toBe(res3.size);
  expect(res.size).toBe(numType.size);
});

test(`Number increases in size`, () => {
  const res = getMergeCommonDataTypesType_([numType, numTypeBiggerSize]);
  expect(res.type).toBe(numType.type);
  expect(res.scale).toBe(numType.scale);
  expect(res.precision).toBe(numTypeBiggerSize.precision);
  expect(res.size).toBe(numTypeBiggerSize.size);
});

test(`String like number remains`, () => {
  const res = getMergeCommonDataTypesType_([stringLikeNum, numType]);
  expect(res.type).toBe(stringLikeNum.type);
  expect(res.string_like_type).toBe(stringLikeNum.string_like_type);
});

test("String like Date remains", () => {
  const res = getMergeCommonDataTypesType_([dateType, stringLikeDateType]);
  expect(res.type).toBe(stringLikeDateType.type);
  expect(res.string_like_type).toBe(stringLikeDateType.string_like_type);
});

test("Different types = string", () => {
  const res = getMergeCommonDataTypesType_([dateType, numType]);
  expect(res.type).toBe("string");
  expect(res.string_like_type).toBe("string");
});
