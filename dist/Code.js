/**
 * Converting colum letter to column index. Start of column index is 0.
 * https://gist.github.com/tanaikech/457b5545a48890ed6dce66d67324ec47
 * @param {String} str Column letter
 * @return {Number} Column index.
 */
function columnLettersToIndex_(str) {
    if (str === void 0) { str = null; }
    str = str.toUpperCase();
    var total = -1;
    var l = str.length;
    for (var i = 0; i < str.length; i++) {
        total += (str[i].charCodeAt(0) - 64) * Math.pow(26, l - i - 1);
    }
    return total;
}

/**
 * @typedef {Object} CellGrid
 * @property {Number|null} [rowIndex]
 * @property {Number|null} [columnIndex]
 */
/**
 * indexes are zero-based
 *
 * @param {String} a1Notation
 * @returns {CellGrid}
 */
function cellA1NotationToCellGrid_(a1Notation) {
    var a1 = a1Notation.replace(/\$/g, "").toUpperCase();
    /**
     * @param {String} txt
     * @returns {Number}
     */
    function _row(txt) {
        return parseInt(txt) - 1;
    }
    // column
    if (/^[A-Z]+$/.test(a1)) {
        return {
            columnIndex: columnLettersToIndex_(a1),
        };
    }
    // row
    if (/^\d+$/i.test(a1)) {
        return {
            rowIndex: _row(a1),
        };
    }
    var parts = a1.match(/[A-Z]+|\d+/g);
    return {
        rowIndex: _row(parts[1]),
        columnIndex: columnLettersToIndex_(parts[0]),
    };
}



/**
 * @param {CellGrid} c1
 * @param {CellGrid} c2
 *
 * @returns {RangeGrid}
 */
function cellGridsToRangeGrid_(c1, c2) {
    // swap rows
    var row1 = c1.rowIndex;
    var row2 = c2.rowIndex;
    if (row1 > row2) {
        c1.rowIndex = row2;
        c2.rowIndex = row1;
    }
    // swap columns
    var col1 = c1.columnIndex;
    var col2 = c2.columnIndex;
    if (col1 > col2) {
        c1.columnIndex = col2;
        c2.columnIndex = col1;
    }
    var endColumnIndex = c2.columnIndex + 1 || null;
    var endRowIndex = c2.rowIndex + 1 || null;
    /** @type {RangeGrid} */
    var result = {
        startColumnIndex: c1.columnIndex,
        startRowIndex: c1.rowIndex,
        endColumnIndex: undefined,
        endRowIndex: undefined
    };
    if (endColumnIndex !== null)
        result.endColumnIndex = endColumnIndex;
    if (endRowIndex !== null)
        result.endRowIndex = endRowIndex;
    return result;
}

/**
 * @typedef {Object} RangeGrid
 * @property {Number} startRowIndex
 * @property {Number} [endRowIndex] 1-based
 * @property {Number} startColumnIndex
 * @property {Number} [endColumnIndex] 1-based
 */

/**
 * start row/column indexes are 0-based
 * end row/column indexes are 1-based
 *
 * @param {RangeValidator_} validator
 * @returns {RangeGrid|null}
 */
function getValidatedRangeA1GridByRanger_(validator) {
    var rangA1Validation = validator.rangeValidate();
    if (!rangA1Validation.is_valid) {
        return null;
    }
    var cells = validator.range_a1.split(":");
    var cellGrid1 = cellA1NotationToCellGrid_(cells[0]);
    /**
     * @param {RangeGrid} grid
     * @returns {RangeGrid|null}
     */
    function _return(grid) {
        var validation = validator.gridValidate(grid);
        if (validation.is_valid === false) {
            return null;
        }
        return grid;
    }
    /** @type RangeGrid */
    // single cell
    var grid;
    if (!cells[1]) {
        grid = {
            startRowIndex: cellGrid1.rowIndex,
            startColumnIndex: cellGrid1.columnIndex,
            endRowIndex: cellGrid1.rowIndex + 1,
            endColumnIndex: cellGrid1.columnIndex + 1,
        };
        return _return(grid);
    }
    var cellGrid2 = cellA1NotationToCellGrid_(cells[1]);
    grid = cellGridsToRangeGrid_(cellGrid1, cellGrid2);
    return _return(grid);
}


/**
 * @param {String} rangeA1
 *
 * @returns {BasicValidation}
 */
function validateRangeA1Notation_(rangeA1) {
    /**
     *  @param {String} message
     * @returns {BasicValidation}
     */
    function _bad(message) {
        return {
            is_valid: false,
            message: message,
        };
    }
    /**
     * @param {String} str
     * @param {RegExp} re
     *
     * @returns {String|null}
     */
    function _regexExtract(str, re) {
        var match = str.match(re);
        return match ? match[0] : null;
    }
    if (typeof rangeA1 !== "string") {
        return _bad("Range must be a string");
    }
    if (rangeA1 === "") {
        return _bad("Range cannot be empty string");
    }
    var unexpectedChar = _regexExtract(rangeA1, /[^$A-Z:0-9]/i);
    if (unexpectedChar) {
        if (unexpectedChar === " ") {
            return _bad("Range has unexpected space: ' '");
        }
        return _bad("Range has unexpected char: " + unexpectedChar);
    }
    if (/:{2,}/.test(rangeA1)) {
        return _bad("Range has more than 1 ':' in a row");
    }
    if (/\${2,}/.test(rangeA1)) {
        return _bad("Range has more than 1 '$' in a row");
    }
    if (/^\d+$/.test(rangeA1)) {
        return _bad("Range cannot be of numbers only");
    }
    if (/^[A-Z]+$/i.test(rangeA1)) {
        return _bad("Range cannot be of letters only");
    }
    if (/^\$+$/.test(rangeA1)) {
        return _bad("Range cannot be of '$' only");
    }
    if (/^:+$/.test(rangeA1)) {
        return _bad("Range cannot be of ':' only");
    }
    if (/^:.*$/.test(rangeA1)) {
        return _bad("Range cannot start with ':'");
    }
    if (/^.*:$/.test(rangeA1)) {
        return _bad("Range cannot end with ':'");
    }
    if (/\$:/.test(rangeA1)) {
        return _bad("Range cannot have lock '$' after colon ':'");
    }
    if (/\$$/.test(rangeA1)) {
        return _bad("Range cannot have lock '$' in the end");
    }
    if (/^\d+[A-Z]+.*/i.test(rangeA1)) {
        return _bad("Range cannot start with number before letter");
    }
    if (/\d+[A-Z]+/i.test(rangeA1)) {
        return _bad("Range cannot have number before letter");
    }
    if (/\d+\$[A-Z]+/i.test(rangeA1)) {
        return _bad("Range cannot have number before '$' and letter");
    }
    if (/\d+\$\d+/i.test(rangeA1)) {
        return _bad("Range cannot have '$' below to numbers");
    }
    if (/[A-Z]+\$[A-Z]+/i.test(rangeA1)) {
        return _bad("Range cannot have '$' below to letters");
    }
    var parts = rangeA1.split(":");
    if (parts.length > 2) {
        return _bad("Range cannot have more than 2 parts: star and ending cell");
    }
    var _ok = {
        is_valid: true,
        message: "ok",
    };
    /**
     * @param {String} str
     * @returns {'cell' | 'column' | 'row'}
     */
    function _getSemiRangeType(str) {
        var cleaned = str.replace(/\$/g, "");
        if (/^\d+$/.test(cleaned))
            return "row";
        if (/^[A-Z]+$/i.test(cleaned))
            return "column";
        return "cell";
    }
    if (parts.length === 2) {
        var type1 = _getSemiRangeType(parts[0]);
        if (type1 === "cell")
            return _ok;
        var type2 = _getSemiRangeType(parts[1]);
        if (type2 === "cell")
            return _ok;
        if (type1 !== type2) {
            return _bad("Cannot form range from ".concat(type1, " and ").concat(type2));
        }
    }
    return _ok;
}


/**
 * @typedef {Object} RangeGridMeasure
 * @prop {Number|null} num_rows
 * @prop {Number|null} num_columns
 * @prop {RangeA1EndType} end_type
 * @prop {RangeA1CellsType} cells_type
 * @prop {RangeA1Orientation} orientation
 */
/** @typedef {'open' | 'closed'} RangeA1EndType */
/** @typedef {'cell' | 'range' | 'line'} RangeA1CellsType */
/** @typedef {'vertical' | 'horizontal' | 'none'} RangeA1Orientation */
/**
 * @param {RangeGrid} grid
 *
 * @returns {RangeGridMeasure}
 */
function getGridA1Measures_(grid) {
    var numRows = null;
    if (grid.endRowIndex) {
        numRows = grid.endRowIndex - grid.startRowIndex;
    }
    var numColumns = null;
    if (grid.endColumnIndex) {
        numColumns = grid.endColumnIndex - grid.startColumnIndex;
    }
    /** @type RangeA1CellsType */
    var cellsType = "cell";
    /** @type RangeA1EndType */
    var endType = "closed";
    /** @type RangeA1Orientation */
    var orientation = "none";
    if (!numRows || !numColumns) {
        cellsType = "line";
        endType = "open";
    }
    else if (numRows === 1 && numColumns === 1) {
        cellsType = "cell";
    }
    else if (numColumns > 1 && numRows > 1) {
        cellsType = "range";
    }
    else {
        cellsType = "line";
    }
    if (!numRows && !numColumns) {
        orientation = "none";
    }
    else if (!numRows) {
        orientation = "vertical";
    }
    else if (!numColumns) {
        orientation = "horizontal";
    }
    else if (numRows > numColumns) {
        orientation = "vertical";
    }
    else if (numRows < numColumns) {
        orientation = "horizontal";
    }
    else {
        orientation = "none";
    }
    return {
        num_rows: numRows,
        num_columns: numColumns,
        cells_type: cellsType,
        end_type: endType,
        orientation: orientation,
    };
}

/**
 * Converting colum index to column letter. Start of column index is 0.
 * Ref: https://stackoverflow.com/a/53678158
 * @param {Number} index Column index.
 * @return {String} Column letter.
 */
function columnIndexToLetters_(index) {
    if (index === void 0) { index = null; }
    var a;
    return (a = Math.floor(index / 26)) >= 0
        ? columnIndexToLetters_(a - 1) + String.fromCharCode(65 + (index % 26))
        : "";
}




/**
 * @param {RangeGrid} grid
 * @param {RangeGridMeasure} measures
 *
 * @returns {BasicValidation}
 */
function validateRangeGrid_(grid, measures) {
    var numMaxColumns = 18278;
    var numMaxCells = Math.pow(10, 7);
    /**
     * @param {String} message
     * @returns {BasicValidation}
     */
    function _invalid(message) {
        return {
            is_valid: false,
            message: message,
        };
    }
    if (measures.num_columns === null && measures.num_rows === null) {
        return _invalid("Range must have last row or last column");
    }
    var numCells = 0;
    var message = "";
    var responses = {
        cells: "Sheet cannot have more than ".concat(numMaxCells, " cells"),
        columns: "Sheet cannot have more than ".concat(numMaxColumns, "(").concat(columnIndexToLetters_(numMaxColumns - 1), ") columns"),
    };
    // C2:50
    if (measures.num_columns === null) {
        numCells = grid.endRowIndex * (grid.startColumnIndex + 1);
        if (numCells > numMaxCells) {
            message =
                "The last row " +
                    grid.endRowIndex +
                    " multiplied by the first column " +
                    (grid.startColumnIndex + 1) +
                    "(".concat(columnIndexToLetters_(grid.startColumnIndex), ")") +
                    " gave " +
                    numCells +
                    " cells. " +
                    responses.cells;
            return _invalid(message);
        }
        if (grid.startColumnIndex + 1 > numMaxColumns) {
            message =
                "The first column '" +
                    columnIndexToLetters_(grid.startColumnIndex) +
                    " reached the limit. " +
                    responses.columns;
            return _invalid(message);
        }
    }
    // H2:J
    if (measures.num_rows === null) {
        numCells = grid.endColumnIndex * (grid.startRowIndex + 1);
        if (numCells > numMaxCells) {
            message =
                "The first row " +
                    (grid.startRowIndex + 1) +
                    " multiplied by the last column " +
                    columnIndexToLetters_(grid.endColumnIndex - 1) +
                    " (".concat(grid.endColumnIndex, ")") +
                    " gave " +
                    numCells +
                    " cells. " +
                    responses.cells;
            return _invalid(message);
        }
        if (grid.endColumnIndex > numMaxColumns) {
            message =
                "The last column " +
                    columnIndexToLetters_(grid.endColumnIndex - 1) +
                    "(".concat(grid.endColumnIndex, ")") +
                    " reached the limit. " +
                    responses.columns;
            return _invalid(message);
        }
    }
    numCells = grid.endColumnIndex * grid.endRowIndex;
    if (numCells > numMaxCells) {
        message =
            "The last row " +
                grid.endRowIndex +
                " multiplied by the last column " +
                grid.endColumnIndex +
                "(".concat(columnIndexToLetters_(grid.endColumnIndex - 1), ")") +
                " gave " +
                numCells +
                " cells. " +
                responses.cells;
        if (measures.cells_type === "cell") {
            message =
                "Cell is outside the bounds. The cell row " +
                    grid.endRowIndex +
                    " multiplied by the cell column " +
                    grid.endColumnIndex +
                    "(".concat(columnIndexToLetters_(grid.endColumnIndex - 1), ")") +
                    " gave " +
                    numCells +
                    " cells. " +
                    responses.cells;
        }
        return _invalid(message);
    }
    if (grid.endColumnIndex > numMaxColumns) {
        message =
            (measures.cells_type === "cell"
                ? "The cell column "
                : "The range column ") +
                columnIndexToLetters_(grid.endColumnIndex - 1) +
                " of index " +
                grid.endColumnIndex +
                " reached the limit. " +
                responses.columns;
        return _invalid(message);
    }
    return {
        is_valid: true,
        message: "ok",
    };
}

/**
 * @typedef {Object} RangeValidationResults
 * @prop {String} message - last message from any of validations
 * @prop {Boolean|null} is_valid
 * @prop {BasicValidation|null} range_validation
 * @prop {BasicValidation|null} grid_validation
 */
/**
 * @typedef {Object} BasicValidation
 * @prop {Boolean} is_valid
 * @prop {String} [message]
 */


/**
 * @constructor
 *
 * @param {String} rangeA1
 */
function RangeValidator_(rangeA1) {
    var self = this;
    self.range_a1 = rangeA1;
    /** @type {RangeValidationResults} */
    self.results = {
        message: "pending",
        is_valid: null,
        range_validation: null,
        grid_validation: null,
    };
    /** @type {RangeGridMeasure|null} */
    self.measures = null;
    /**
     * @method
     * @returns {BasicValidation}
     */
    self.rangeValidate = function () {
        if (self.results.range_validation)
            return self.results.range_validation;
        var rangeValidation = validateRangeA1Notation_(self.range_a1);
        self.results.range_validation = rangeValidation;
        _updateIsValid(rangeValidation);
        return rangeValidation;
    };
    /**
     * @method
     * @param {RangeGrid} grid
     */
    self.gridValidate = function (grid) {
        if (!self.measures) {
            self.measures = getGridA1Measures_(grid);
        }
        var gridValidation = validateRangeGrid_(grid, self.measures);
        self.results.grid_validation = gridValidation;
        _updateIsValid(gridValidation);
        return gridValidation;
    };
    /**
     * @method
     * @returns {RangeValidationResults}
     */
    self.getValidations = function () {
        return self.results;
    };
    /**
     * @param {BasicValidation} validation
     */
    function _updateIsValid(validation) {
        var isValid = validation.is_valid;
        if (isValid === false) {
            self.results.is_valid = false;
            self.results.message = validation.message;
        }
        if (isValid === true) {
            if (self.results.is_valid === false)
                return;
            self.results.is_valid = true;
            self.results.message = validation.message;
        }
    }
}



/**
 * @constructor
 * @param {string} rangeA1
 */
function Ranger_(rangeA1) {
    var self = this;
    /** @type {RangeGrid|null} */
    var grid = null;
    var validator = new RangeValidator_(rangeA1);
    /**
     * @method
     * @returns {RangeGrid|null}
     */
    self.grid = function () {
        if (grid)
            return grid;
        grid = getValidatedRangeA1GridByRanger_(validator);
        return grid;
    };
    /**
     * @returns {RangeValidationResults}
     */
    self.validation = function () {
        return validator.getValidations();
    };
}

function test_ranger() {
    var ranger = new Ranger_("A1:B25");
    var grid = ranger.grid();
    if (!grid) {
        console.log(ranger.validation().message);
    }
    else {
        console.log(JSON.stringify(grid, null, 2));
    }
}
