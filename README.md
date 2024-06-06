# A1ranger

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

```json
{
  "startColumnIndex": 0,
  "startRowIndex": 0,
  "endColumnIndex": 2,
  "endRowIndex": 25
}
```

# Typer

Use typer:

```javascript
    var typer = new Typer_("true");
    console.log(JSON.stringify(typer.getType(), null, 2));
```

Will log this:

```json
{
  "type": "string",
  "string_like_type": "boolean"
}
```

# Tabler

Use tabler:

```
var ss = SpreadsheetApp.getActive();
var s = ss.getActiveSheet();
var r = s.getDataRange();
var values = r.getValues();
var tt = new Tabler_(values);
var res = tt.getSchema();
console.log(res);
```

results this:

```
{
  "data_coordinates": {
    "grids": [
      {
        "startColumnIndex": 2,
        "endColumnIndex": 5,
        "startRowIndex": 8,
        "endRowIndex": 14
      },
      {
        "startColumnIndex": 2,
        "endColumnIndex": 5,
        "startRowIndex": 15,
        "endRowIndex": 22
      },
      {
        "startColumnIndex": 2,
        "endColumnIndex": 5,
        "startRowIndex": 23,
        "endRowIndex": 35
      },
      {
        "startColumnIndex": 6,
        "endColumnIndex": 8,
        "startRowIndex": 8,
        "endRowIndex": 14
      },
      {
        "startColumnIndex": 6,
        "endColumnIndex": 8,
        "startRowIndex": 15,
        "endRowIndex": 22
      },
      {
        "startColumnIndex": 6,
        "endColumnIndex": 8,
        "startRowIndex": 23,
        "endRowIndex": 35
      },
      {
        "startColumnIndex": 9,
        "endColumnIndex": 10,
        "startRowIndex": 8,
        "endRowIndex": 14
      },
      {
        "startColumnIndex": 9,
        "endColumnIndex": 10,
        "startRowIndex": 15,
        "endRowIndex": 22
      },
      {
        "startColumnIndex": 9,
        "endColumnIndex": 10,
        "startRowIndex": 23,
        "endRowIndex": 35
      }
    ],
    "ranges_a1": [
      "C9:E14",
      "C16:E22",
      "C24:E35",
      "G9:H14",
      "G16:H22",
      "G24:H35",
      "J9:J14",
      "J16:J22",
      "J24:J35"
    ]
  },
  "header_coordinates": {
    "grids": [
      {
        "startRowIndex": 5,
        "startColumnIndex": 2,
        "endRowIndex": 6,
        "endColumnIndex": 5
      },
      {
        "startRowIndex": 5,
        "startColumnIndex": 6,
        "endRowIndex": 6,
        "endColumnIndex": 8
      },
      {
        "startRowIndex": 5,
        "startColumnIndex": 9,
        "endRowIndex": 6,
        "endColumnIndex": 10
      }
    ],
    "ranges_a1": [
      "C6:E6",
      "G6:H6",
      "J6"
    ]
  },
  "fields": [
    {
      "column_index": 2,
      "database_value": "product_id",
      "original_value": "product id",
      "is_generic_header": false,
      "type": "string",
      "string_like_type": "int",
      "size": 2,
      "precision": 2,
      "scale": 0
    },
    {
      "column_index": 3,
      "database_value": "_1product_name",
      "original_value": "1product name",
      "is_generic_header": false,
      "type": "string",
      "string_like_type": "string",
      "size": 12,
      "precision": 0,
      "scale": 0
    },
    {
      "column_index": 4,
      "database_value": "units_sold",
      "original_value": "units sold",
      "is_generic_header": false,
      "type": "int",
      "size": 3,
      "precision": 3,
      "scale": 0
    },
    {
      "column_index": 6,
      "database_value": "revenue",
      "original_value": "*revenue",
      "is_generic_header": false,
      "type": "string",
      "string_like_type": "string",
      "size": 7,
      "precision": 0,
      "scale": 0
    },
    {
      "column_index": 7,
      "database_value": "profit",
      "original_value": "profit",
      "is_generic_header": false,
      "type": "string",
      "string_like_type": "string",
      "size": 11,
      "precision": 0,
      "scale": 0
    },
    {
      "column_index": 9,
      "database_value": "date_",
      "original_value": "date",
      "is_generic_header": false,
      "type": "string",
      "string_like_type": "date",
      "size": 10,
      "precision": 0,
      "scale": 0
    }
  ],
  "row_data_starts": 8,
  "row_data_ends": 34,
  "row_headers": 5,
  "skipped_column_indexes": [
    5,
    8
  ],
  "skipped_row_indexes": [
    14,
    22
  ]
}
```

...
