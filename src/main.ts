import { Ranger_ } from "./ranger";

export function test_ranger() {
  const ranger = new Ranger_("A1:B25");
  const grid = ranger.grid();
  if (!grid) {
    console.log(ranger.validation().message);
  } else {
    console.log(JSON.stringify(grid, null, 2));
  }
}
