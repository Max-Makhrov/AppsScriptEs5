import { Ranger_ } from "./ranger";
import { Typer_ } from "./typer";

export function test_ranger() {
  const ranger = new Ranger_("A1:B25");
  const grid = ranger.grid();
  if (!grid) {
    console.log(ranger.validation().message);
  } else {
    console.log(JSON.stringify(grid, null, 2));
  }

  const typer = new Typer_("true");
  console.log(JSON.stringify(typer.getType(), null, 2));
}
