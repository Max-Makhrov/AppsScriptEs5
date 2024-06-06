import { getAllFitClustersInfo_ } from "./columntypecluster/getallfitclusters";
import { getValuesheaderHeadersRangeGrids_ } from "./columntypecluster/grids/headergrids";
import { getValuesClustersRangeGrids_ } from "./columntypecluster/grids/clustergrids";
import { getRangeGridByRangeA1_ } from "@/rangers/converters/grid_to_range";

/** @typedef {import("@/talbler").RangeValues} RangeValues */
/** @typedef {import("@/typers/gettype").BasicDataType} BasicDataType  */
/** @typedef {import ("@/rangers/grid").RangeGrid} RangeGrid */

/**
 * @typedef {Object} SheetTableSchema
 * @prop {SheetFieldSchema[]} fields
 * @prop {SheetRangeGroupCoordinates} header_coordinates
 * @prop {SheetRangeGroupCoordinates} data_coordinates
 * @prop {Number[]} skipped_row_indexes
 * @prop {Number[]} skipped_column_indexes
 * @prop {Number} row_data_starts
 * @prop {Number} row_data_ends
 * @prop {Number} row_headers
 */

/**
 * @typedef {Object} SheetRangeGroupCoordinates
 * @prop {RangeGrid[]} grids
 * @prop {String[]} ranges_a1
 */

/**
 * @typedef {Object} SheetFieldSchema
 * @prop {String} original_value - how field named in Sheets
 * @prop {String} database_value - field name for database
 * @prop {Boolean} is_generic_header - true if header was creaed artificially
 * @prop {BasicDataType} type
 * @prop {BasicDataType} [string_like_type] - type by text if type is text
 * @prop {number} size - The size or length
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 * @prop {number} column_index
 */

/**
 * @param {RangeValues} values
 * @param {Number} rowIndex - not used yet. May be used to find next schema in grid
 * @param {Number} colIndex - not used yet. May be used to find next schema in grid
 *
 * @returns {SheetTableSchema|null}
 */
export function getTheFirstSheetSchema_(values, rowIndex = 0, colIndex = 0) {
  if (!values) return null;
  if (!values.length) return null;
  if (!values[0].length) return null;
  if (values.length < 2) return null;

  const fitResults = getAllFitClustersInfo_(values);
  if (!fitResults) return null;
  if (!fitResults.headers.length) return null;
  const headerGrids = getValuesheaderHeadersRangeGrids_(fitResults.headers);
  const dataGrids = getValuesClustersRangeGrids_(
    fitResults.clusters,
    fitResults.row_data_starts,
    fitResults.row_data_ends,
    fitResults.missing_rows
  );
  /** @type {SheetRangeGroupCoordinates} */
  const headerCoordinates = {
    grids: headerGrids,
    ranges_a1: headerGrids.map(getRangeGridByRangeA1_),
  };
  /** @type {SheetRangeGroupCoordinates} */
  const dataCoordinates = {
    grids: dataGrids,
    ranges_a1: dataGrids.map(getRangeGridByRangeA1_),
  };

  /** @type {SheetFieldSchema[]} */
  const fields = [];
  fitResults.clusters.sort((a, b) => {
    return a.column_index - b.column_index;
  });
  fitResults.headers.sort((a, b) => {
    return a.column_index - b.column_index;
  });

  fitResults.clusters.forEach((c, i) => {
    const h = fitResults.headers[i];
    fields.push({
      column_index: c.column_index,
      database_value: h.database_value,
      original_value: h.original_value,
      is_generic_header: h.is_generic,
      type: c.type,
      string_like_type: c.string_like_type,
      size: c.max_size,
      precision: c.max_precision,
      scale: c.max_scale,
    });
  });

  return {
    data_coordinates: dataCoordinates,
    header_coordinates: headerCoordinates,
    fields,
    row_data_starts: fitResults.row_data_starts,
    row_data_ends: fitResults.row_data_ends,
    row_headers: fitResults.headers[0].row_index,
    skipped_column_indexes: fitResults.missing_columns,
    skipped_row_indexes: fitResults.missing_rows,
  };
}
