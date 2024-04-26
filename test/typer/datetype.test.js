import { getDateBasicType_ } from "@/typers/getdatetype";

import { expect, test } from "vitest";

// Create date for 'datetime'
const dateTimeCases = [
  new Date("2023-02-10T04:30:00"),
  new Date("2022-03-21T21:15:00"),
  new Date("2023-12-31T00:01:00"),
];

// Create date for 'date'
const dateCases = [
  new Date("2023-02-10T00:00:00"),
  new Date("2022-03-21T00:00:00"),
  new Date("2023-12-31T00:00:00"),
];

dateTimeCases.forEach((value) => {
  test(`DateType should be datetime`, () => {
    const res = getDateBasicType_(value);
    expect(res.type).toBe("datetime");
  });
});
dateCases.forEach((value) => {
  test(`DateType should be date`, () => {
    const res = getDateBasicType_(value);
    expect(res.type).toBe("date");
  });
});
