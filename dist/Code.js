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

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/** @typedef {'int' | 'number'} BasicNumberType */
/**
 * @typedef {Object} BasicNumberTypeResponse
 * @prop {BasicNumberType} type
 * @prop {number} precision - The total number of digits (for numeric types).
 * @prop {number} scale - The number of digits after the decimal point (for numeric types).
 */
/**
 *
 * @param {Number} number
 * @returns {BasicNumberTypeResponse}
 */
function getBasicNumberType_(number) {
    var absoluteNumber = Math.abs(number);
    if (Math.round(number) - number === 0) {
        return {
            type: "int",
            precision: Math.round(absoluteNumber).toString().length,
            scale: 0,
        };
    }
    var numberString = absoluteNumber.toString();
    var splitNumber = numberString.split(".");
    return {
        type: "number",
        precision: numberString.replace(".", "").length,
        scale: splitNumber.length > 1 ? splitNumber[1].length : 0,
    };
}

/** @typedef {'date' | 'datetime'} BasicDateType */
/**
 * @typedef {Object} BasicDateTypeResponse
 * @prop {BasicDateType} type
 */
/**
 *
 * @param {Date} date
 * @returns {BasicDateTypeResponse}
 */
function getDateBasicType_(date) {
    if (date.getHours() !== 0 ||
        date.getMinutes() !== 0 ||
        date.getSeconds() !== 0) {
        return { type: "datetime" };
    }
    return { type: "date" };
}

/**
 * @typedef {'int' | 'number'} BasicDataType
 */
/**
 * @typedef {Object} ScaleAndPrecision
 * @prop {BasicDataType} string_like_type
 * @prop {Number} precision
 * @prop {Number} scale
 */
/**
 *
 * @param {String} value
 * @returns {ScaleAndPrecision}
 */
function textAsNumber2Type_(value) {
    // remove negative sign, if any, for count
    var numberValue = value.charAt(0) === "-" ? value.substring(1) : value;
    var dotIndex = numberValue.indexOf(".");
    var precision = numberValue.length;
    var scale = 0;
    /** @type {BasicDataType} */
    var type = "number";
    if (dotIndex !== -1) {
        var absValueStr = numberValue.replace(/0+$/, ""); // remove trailing zeros
        if (/\.$/.test(absValueStr))
            type = "int";
        precision = absValueStr.replace(".", "").length; // recount precision after removal of zeros
        scale = absValueStr.length - dotIndex - 1; // recount scale after removal of zeros
    }
    else {
        type = "int";
    }
    return {
        precision: precision,
        scale: scale,
        string_like_type: type,
    };
}


/**
 * @typedef {Object} StringValueTypeResponse
 * @prop {BasicDataType} string_like_type
 * @prop {number} [size] - The size or length (for string types).
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 */
/**
 *
 * @param {String} value
 * @returns {StringValueTypeResponse}
 */
function getStringLikeType_(value) {
    if (value === "")
        return { string_like_type: "null" };
    var lower = value.toLocaleLowerCase();
    if (lower === "null")
        return { string_like_type: "null" };
    if (lower === "true" || lower === "false")
        return { string_like_type: "boolean" };
    // TODO => write correct date-time processor. No allow 30th February
    if (/^(0[1-9]\d{2}|[1-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value)) {
        return { string_like_type: "date" };
    }
    if (/^(0[1-9]\d{2}|[1-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(value)) {
        return { string_like_type: "datetime" };
    }
    if (/^\d+$/.test(value)) {
        return {
            string_like_type: "int",
            precision: value.length,
            scale: 0,
        };
    }
    if (/^\-?\d+(\.\d+)?$/.test(value)) {
        return __assign({}, textAsNumber2Type_(value));
    }
    // ...   // 'object' | 'array' | TODO?
    return {
        string_like_type: "string",
        size: value.length,
    };
}

/**
 * @typedef {'date' | 'datetime' | 'int' | 'number' | 'string' | 'boolean' | 'object' | 'array' | 'null' | 'unknown'} BasicDataType
 */
/**
 * @typedef {Object} TypeCheckResult
 * @prop {BasicDataType} type
 * @prop {BasicDataType} [string_like_type] - type by text if type is text
 * @prop {number} [size] - The size or length (for string types).
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 */
/**
 * @param {*} value
 *
 * @returns {TypeCheckResult}
 */
function getBasicType_(value) {
    if (value === null || value === undefined) {
        return {
            type: "null",
        };
    }
    if (value === true || value === false) {
        return {
            type: "boolean",
        };
    }
    if (Array.isArray(value)) {
        return {
            type: "array",
        };
    }
    if (typeof value === "number") {
        return getBasicNumberType_(value);
    }
    if (value instanceof Date) {
        return getDateBasicType_(value);
    }
    if (value && typeof value === "object" && value.constructor === Object) {
        return {
            type: "object",
        };
    }
    if (typeof value === "string") {
        return __assign({ type: "string" }, getStringLikeType_(value));
    }
    return {
        type: "unknown",
    };
}


/**
 * @constructor
 * @param {*} value
 */
function typerStore_(value) {
    var self = this;
    self.value = value;
    /** @type {TypeCheckResult} */
    self.type = null;
    /**
     * @method
     * @returns {TypeCheckResult}
     */
    self.getType = function () {
        if (self.type)
            return self.type;
        self.type = getBasicType_(self.value);
        return self.type;
    };
}


/**
 * @constructor
 * @param {*} value
 */
function Typer_(value) {
    var self = this;
    var store = new typerStore_(value);
    /**
     * @method
     * @returns {TypeCheckResult}
     */
    self.getType = function () {
        return store.getType();
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
    var typer = new Typer_("true");
    console.log(JSON.stringify(typer.getType(), null, 2));
}
