# a1ranger

All you wanted to do with "A1:D5" ranges. JS-only code for managing Google Sheets ranges.

Dist folder has a [compatible ES-5 code](https://github.com/Max-Makhrov/a1ranger/blob/master/dist/Code.js), can be used from both back-, and front-end.

```javascript
function test_ranger() {
  const ranger = new Ranger_("A1:B25");
  const grid = ranger.grid();
  if (!grid) {
    console.log(ranger.validation().message);
  } else {
    console.log(JSON.stringify(grid, null, 2));
  }
}
```

Will log this:

```
{
  "startColumnIndex": 0,
  "startRowIndex": 0,
  "endColumnIndex": 2,
  "endRowIndex": 25
}
```

Use typer:

```javascript
    var typer = new Typer_("true");
    console.log(JSON.stringify(typer.getType(), null, 2));
```

Will log this:

```
{
  "type": "string",
  "string_like_type": "boolean"
}
```
