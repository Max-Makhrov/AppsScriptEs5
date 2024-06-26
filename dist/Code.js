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
 * @prop {number} size - The size or length
 * @prop {number} [precision] - The total number of digits (for numeric types).
 * @prop {number} [scale] - The number of digits after the decimal point (for numeric types).
 */
/**
 * @param {*} value
 *
 * @returns {TypeCheckResult}
 */
function getBasicType_(value) {
    var size = ("" + value).length;
    var jsonValue = JSON.stringify(value) || "";
    var jsonSize = jsonValue.length;
    if (value === null || value === undefined) {
        return {
            type: "null",
            size: size,
        };
    }
    if (value === true || value === false) {
        return {
            type: "boolean",
            size: jsonSize,
        };
    }
    if (Array.isArray(value)) {
        return {
            type: "array",
            size: jsonSize,
        };
    }
    if (typeof value === "number") {
        return __assign(__assign({}, getBasicNumberType_(value)), { size: size });
    }
    if (value instanceof Date) {
        return __assign(__assign({}, getDateBasicType_(value)), { size: jsonSize });
    }
    if (value && typeof value === "object" && value.constructor === Object) {
        return {
            type: "object",
            size: jsonSize,
        };
    }
    if (typeof value === "string") {
        return __assign(__assign({ type: "string" }, getStringLikeType_(value)), { size: size });
    }
    return {
        type: "unknown",
        size: size,
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


/**
 * @typedef {Object} ValuesCheckResponse
 * @prop {Boolean} is_valid
 * @prop {String} message
 */
/**
 * @param {RangeValues|*} values
 * @returns {ValuesCheckResponse}
 */
function checkValuesIsvalidRectangle_(values) {
    /**
     * @param {String} message
     *
     * @returns {ValuesCheckResponse}
     */
    function _notValid(message) {
        return {
            is_valid: false,
            message: message,
        };
    }
    if (!values)
        return _notValid("No values provided");
    if (!Array.isArray(values))
        return _notValid("Values is not array");
    if (!values.length)
        return _notValid("Values have no rows");
    if (!values[0])
        return _notValid("Values have empty row");
    if (!values[0].length)
        return _notValid("Values have no columns");
    var numCols = values[0].length;
    for (var i = 1; i < values.length; i++) {
        if (values[i].length !== numCols) {
            return _notValid("Values are not a rectangle");
        }
    }
    return {
        is_valid: true,
        message: "ok",
    };
}


// TODO: check cluster quality?
// Check if
//   1) Cluster group has more non-string clusters?
//   2) Longer clusters?
//   3) Clusters with less empty cells?
/*
  1. if clusters have non-string types => lower headers?...
  2. clusters have bigger number of elements?
  3.
*/

/**
 * @typedef {Object} ColumnValuesClusterIslandQuality
 * @prop {Number} max_values [v]
 * @prop {Number} number_of_elements [v]
 * @prop {Number} min_column [v]
 * @prop {Number} header_row
 * @prop {BasicDataType[]} types_or_string_types
 */
/**
 * @param {SchemaValuesCluster[][]} fitClusterOptions
 *
 * @returns {SchemaValuesCluster[]} best cluster set
 */
function getBestValueClustersFullInfoForSchema_(fitClusterOptions) {
    if (!fitClusterOptions)
        return [];
    if (!fitClusterOptions.length)
        return [];
    /** @type {ColumnValuesClusterIslandQuality[]} */
    var qualities = [];
    fitClusterOptions.forEach(function (island) {
        var rowNums = island.map(function (i) {
            return (i.cluster.end_index -
                i.cluster.end_index +
                1 -
                i.cluster.indexes_null.length);
        });
        var maxValues = Math.max.apply(Math, rowNums);
        var types = island.map(function (i) {
            var typ = i.cluster.type;
            if (typ === "string")
                typ = i.cluster.string_like_type;
            return typ;
        });
        var columns = island.map(function (i) { return i.cluster.column_index; });
        var minColumn = Math.min.apply(Math, columns);
        /** @type {ColumnValuesClusterIslandQuality} */
        var quality = {
            min_column: minColumn,
            header_row: island[0].header.row_index,
            max_values: maxValues,
            number_of_elements: island.length,
            types_or_string_types: types,
        };
        qualities.push(quality);
    });
    // try to find clusters with max number of values
    var arrayMaxValues = qualities.map(function (q) { return q.max_values; });
    var maxValues = Math.max.apply(Math, arrayMaxValues);
    var groupsMaxValues = fitClusterOptions.filter(function (island, indx) { return qualities[indx].max_values === maxValues; });
    if (groupsMaxValues.length === 1) {
        return groupsMaxValues[0];
    }
    // try find cluster with more elements
    var maxElements = Math.max.apply(Math, qualities.map(function (q) { return q.number_of_elements; }));
    var groupsMaxElements = groupsMaxValues.filter(function (island, indx) { return qualities[indx].number_of_elements === maxElements; });
    if (groupsMaxElements.length === 1) {
        return groupsMaxElements[0];
    }
    // try get group from left-most column
    var minColumn = Math.min.apply(Math, qualities.map(function (q) { return q.min_column; }));
    var groupsMinColumnElements = groupsMaxElements.filter(function (island, indx) { return qualities[indx].min_column === minColumn; });
    if (groupsMinColumnElements.length === 1) {
        return groupsMinColumnElements[0];
    }
    // get element with the minimal header row
    var headerRows = qualities.map(function (q) { return q.header_row; });
    var minHeader = Math.min.apply(Math, headerRows);
    var minHeaderElement = groupsMinColumnElements.find(function (island, indx) { return qualities[indx].header_row === minHeader; });
    return minHeaderElement;
}

/** @typedef {import("../../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/


/**
 * @param {SheetColumnNamedClusterHeader} header
 * @param {PossibleSchemaClustersInfo} possibleSchemaInfo
 *
 * @returns {SchemaValuesCluster[]}
 */
function _findMatchingColumnValuesClusters_(header, possibleSchemaInfo) {
    var columnIndex = header.column_index;
    /** @type SchemaValuesCluster[] */
    var results = [];
    possibleSchemaInfo.clusters_rows_fit.forEach(function (el, i) {
        if (el.column_index !== columnIndex)
            return;
        results.push({
            cluster: el,
            header: header,
            possible_rows_start: possibleSchemaInfo.possible_rows_map[i],
        });
    });
    return results;
}


/** @typedef {import("../../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/**
 *
 * @param {SheetColumnNamedClusterHeader[][]} biggestIslands
 *  @param {PossibleSchemaClustersInfo} possibleSchemaInfo
 *
 * @returns {SchemaValuesCluster[][][]}
 */
function _getFullInfoSortingColumnValueClusterCollections_(biggestIslands, possibleSchemaInfo) {
    /** @type {SchemaValuesCluster[][][]} */
    var sortingCollections = [];
    biggestIslands.forEach(function (island) {
        /** @type {SchemaValuesCluster[][]} */
        var collection = [];
        island.forEach(function (header) {
            var elements = _findMatchingColumnValuesClusters_(header, possibleSchemaInfo);
            collection.push(elements);
        });
        if (collection.length) {
            sortingCollections.push(collection);
        }
    });
    return sortingCollections;
}


/**
 * @typedef {Object} FullColumnValuesClustersPossibleRowsMap
 * @prop {number} collection_position
 * @prop {FullColumnValuesClustersPossibleRowsMapElement[]} elements
 * @prop {number} num_of_elements
 */
/**
 * @typedef {Object} FullColumnValuesClustersPossibleRowsMapElement
 * @prop {number} index
 * @prop {number[]} rows
 * @prop {number} min_row
 */
/**
 *
 * @param {SchemaValuesCluster[][]}  collection
 *
 * @returns {FullColumnValuesClustersPossibleRowsMap[]}
 */
function _getFullColumnValuesClustersPossibleRowsMap_(collection) {
    var possibleRowsMap = collection
        .map(function (c) {
        return c
            .map(function (cc, i) {
            var rws = cc.possible_rows_start.filter(function (r) { return r > cc.header.row_index; });
            return {
                index: i,
                rows: rws,
                min_row: Math.min.apply(Math, rws),
            };
        })
            .filter(function (el) { return el.rows.length > 0; });
    })
        .map(function (el, collection_position) {
        return {
            collection_position: collection_position,
            elements: el,
            num_of_elements: el.length,
        };
    })
        .filter(function (el) { return el.num_of_elements > 0; });
    return possibleRowsMap;
}

/**
 * @param {Number[]} rs1
 * @param {Number[]} rs2
 * @returns {Boolean}
 */
function _checkTwoRowArraysHasCommonRows_(rs1, rs2) {
    for (var index = 0; index < rs1.length; index++) {
        var element = rs1[index];
        if (rs2.indexOf(element) > -1)
            return true;
    }
    return false;
}



/**
 * @param {FullColumnValuesClustersPossibleRowsMap[]} possibleRowsMap
 * @param {FullColumnValuesClustersPossibleRowsMap} bestRowMapMatch
 * @param {SchemaValuesCluster[][]} collection
 *
 * @returns {SchemaValuesCluster[]}
 */
function _getBestColumnValuesClusterRowOptions_(possibleRowsMap, bestRowMapMatch, collection) {
    var bestClusterRowOptions = possibleRowsMap
        .map(function (subCol) {
        if (subCol.collection_position === bestRowMapMatch.collection_position) {
            var matchedColl = collection[subCol.collection_position][subCol.elements[0].index];
            /** @type {SchemaValuesCluster} */
            var res = {
                cluster: matchedColl.cluster,
                header: matchedColl.header,
                possible_rows_start: bestRowMapMatch.elements[0].rows,
            };
            return res;
        }
        var matchingStartRows = subCol.elements.filter(function (e) {
            var rows = e.rows;
            var hasCommon = _checkTwoRowArraysHasCommonRows_(rows, bestRowMapMatch.elements[0].rows);
            return hasCommon;
        });
        if (matchingStartRows.length == 1) {
            var matchElt = matchingStartRows[0];
            var matchedColl2 = collection[subCol.collection_position][matchElt.index];
            /** @type {SchemaValuesCluster} */
            var res1 = {
                cluster: matchedColl2.cluster,
                header: matchedColl2.header,
                possible_rows_start: matchElt.rows,
            };
            return res1;
        }
        if (matchingStartRows.length == 0) {
            return null;
        }
        var minRowStartLast = Math.min.apply(Math, matchingStartRows.map(function (e) { return e.min_row; }));
        var resMin = matchingStartRows.find(function (e) { return e.min_row === minRowStartLast; });
        var grpLast = collection[subCol.collection_position][resMin.index];
        /** @type {SchemaValuesCluster} */
        var resLast = {
            cluster: grpLast.cluster,
            header: grpLast.header,
            possible_rows_start: resMin.rows,
        };
        return resLast;
    })
        .filter(function (e) { return e !== null; });
    return bestClusterRowOptions;
}

/**
 *
 * @param {Number[]} rowsToCheck
 * @param {Number} clustersToReduceIndex
 * @param {Number[][][]} allPossibleRowsStart
 *
 * @returns {Boolean}
 */
function _checkAllGroupsHasCommonRows_(rowsToCheck, clustersToReduceIndex, allPossibleRowsStart) {
    /**
     *
     * @param {Number[]} inCommonRows
     * @param {Number[]} rowsAgainst
     *
     * @returns {Number[]}
     */
    function _getInCommons_(inCommonRows, rowsAgainst) {
        var inCommon = [];
        inCommonRows.forEach(function (r) {
            if (rowsAgainst.indexOf(r) === -1)
                return;
            inCommon.push(r);
        });
        return inCommon;
    }
    var groupsToCheck = allPossibleRowsStart.filter(function (el, i) { return i !== clustersToReduceIndex; });
    if (groupsToCheck.length === 0)
        return true;
    /** @type {Number[][]} */
    var inCommon = [rowsToCheck]; // all rows from the start
    var _loop_1 = function (i) {
        /** @type {Number[][]} */
        var rowsAgainsCollection = groupsToCheck[i]; // number[][]
        /** @type {Number[][]} */
        var nextInCommon = [];
        rowsAgainsCollection.forEach(function (rowsAgainst) {
            inCommon.forEach(function (inCommonRows) {
                var common = _getInCommons_(inCommonRows, rowsAgainst);
                if (common.length === 0)
                    return;
                nextInCommon.push(common);
            });
        });
        inCommon = nextInCommon;
        if (inCommon.length === 0)
            return { value: false };
    };
    for (var i = 0; i < groupsToCheck.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return true;
}


/**
 * @param {SchemaValuesCluster[][]} collection
 *
 * @returns {SchemaValuesCluster[][]}
 */
function _getReducedColumnValuesClusterCollection_(collection) {
    /** @type {Number[][][]} */
    var allPossibleRowsStart = collection.map(function (c) {
        return c.map(function (e) { return e.possible_rows_start; });
    });
    /** @type {SchemaValuesCluster[][]} */
    var reducedCollection = [];
    collection.forEach(function (clustersToReduce, clustersToReduceIndex) {
        /** @type {Number[][]} */
        allPossibleRowsStart[clustersToReduceIndex];
        /** @type {SchemaValuesCluster[]} */
        var clustersToAdd = [];
        clustersToReduce.forEach(function (cls, clsIndex) {
            var rowsToCheck = cls.possible_rows_start;
            var hasCommons = _checkAllGroupsHasCommonRows_(rowsToCheck, clustersToReduceIndex, allPossibleRowsStart);
            if (!hasCommons)
                return;
            clustersToAdd.push(cls);
        });
        if (clustersToAdd.length === 0)
            return;
        reducedCollection.push(clustersToAdd);
    });
    /** @type {Number[][][]} */
    var allReducedRowsStart = reducedCollection.map(function (c) {
        return c.map(function (e) { return e.possible_rows_start; });
    });
    /**
     * @param {Number} num
     * @param {Number[][][]} allReducedRowsStart
     * @param {Number} groupIndex
     *
     * @returns {Boolean}
     */
    function _isCorrectNumber_(num, allReducedRowsStart, groupIndex) {
        var groupsCheck = allReducedRowsStart.filter(function (g, i) { return i !== groupIndex; });
        for (var i = 0; i < groupsCheck.length; i++) {
            var grp = groupsCheck[i];
            var found = grp.find(function (rws) {
                return rws.indexOf(num) > -1;
            });
            if (!found)
                return false;
        }
        return true;
    }
    // reduce rows if not all groups have this row
    reducedCollection = reducedCollection.map(function (el, groupIndex) {
        var newEl = [];
        /** @type {Number[][]} */
        el.forEach(function (e) {
            var numbers = e.possible_rows_start;
            var fixedNumbers = [];
            numbers.forEach(function (num) {
                var isCorrect = _isCorrectNumber_(num, allReducedRowsStart, groupIndex);
                if (!isCorrect)
                    return;
                fixedNumbers.push(num);
            });
            if (fixedNumbers.length === 0)
                return;
            e.possible_rows_start = fixedNumbers;
            newEl.push(e);
        });
        return newEl;
    });
    return reducedCollection;
}

/** @typedef {import("../../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @typedef {Object} SchemaValuesCluster
 * @prop {SheetsValuesColumnCluster} cluster
 * @prop {SheetColumnNamedClusterHeader} header
 * @prop {Number[]} possible_rows_start
 */
/**
 * @param {SheetColumnNamedClusterHeader[][]} biggestIslands
 * @param {PossibleSchemaClustersInfo} possibleSchemaInfo
 *
 * @returns {SchemaValuesCluster[][]} possible group > schema cluster
 */
function getFullValuesClusterHeaderInfoMap_(biggestIslands, possibleSchemaInfo) {
    if (!biggestIslands)
        return [];
    if (!biggestIslands.length)
        return [];
    /** @type {SchemaValuesCluster[][][]} */
    var sortingCollections = _getFullInfoSortingColumnValueClusterCollections_(biggestIslands, possibleSchemaInfo);
    /** @type {SchemaValuesCluster[][]} */
    var finalRes = [];
    sortingCollections.forEach(function (collectionFull) {
        var collection = _getReducedColumnValuesClusterCollection_(collectionFull);
        // const collection = collectionFull;
        // decide what clusters to use
        // exclude using matching possible rows data can start from
        var possibleRowsMap = _getFullColumnValuesClustersPossibleRowsMap_(collection);
        if (possibleRowsMap.length === 0) {
            return;
        }
        var minElements = Math.min.apply(Math, possibleRowsMap.map(function (e) { return e.num_of_elements; }));
        var bestRowMapMatch = possibleRowsMap.find(function (e) { return e.num_of_elements === minElements; });
        var minRowBestMapStarts;
        if (bestRowMapMatch.elements.length > 1) {
            // try to find by minimal row data starts
            minRowBestMapStarts = Math.min.apply(Math, bestRowMapMatch.elements.map(function (e) { return e.min_row; }));
            bestRowMapMatch.elements = [
                bestRowMapMatch.elements.find(function (e) { return e.min_row === minRowBestMapStarts; }),
            ];
        }
        var bestClusterRowOptions = _getBestColumnValuesClusterRowOptions_(possibleRowsMap, bestRowMapMatch, collection);
        finalRes.push(bestClusterRowOptions);
    });
    return finalRes;
}

/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/**
 * Returns more than 1 if same number of headers
 *
 * @param {SheetColumnNamedClusterHeader[][][]} headerIslands
 *
 * @returns {SheetColumnNamedClusterHeader[][]}
 */
function getBiggerClusterHeadersByIslands_(headerIslands) {
    var result = [];
    if (!headerIslands)
        return result;
    if (!headerIslands.length)
        return result;
    if (!headerIslands[0].length)
        return result;
    if (!headerIslands[0][0].length)
        return result;
    var maxLength = 0;
    var biggerIslands = [];
    headerIslands.forEach(function (rowGroup) {
        return rowGroup.forEach(function (island) {
            if (island.length > maxLength) {
                biggerIslands = [island];
                maxLength = island.length;
            }
            else if (island.length === maxLength) {
                biggerIslands.push(island);
            }
        });
    });
    return biggerIslands;
}

/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/**
 * @param {SheetColumnNamedClusterHeader[][]} validHeadersMap
 * @param {Number[][]} possibleFirstDataRows
 *
 * @returns {SheetColumnNamedClusterHeader[][][]} headerIslands - row > island > header
 */
function getColumnValueClusterHeaderIslands_(validHeadersMap, possibleFirstDataRows) {
    /** @type SheetColumnNamedClusterHeader[][][] */
    var result = [];
    var maxHeaderRow = 0;
    possibleFirstDataRows.forEach(function (rs) {
        var maxRow = Math.max.apply(Math, rs);
        var maxHRow = maxRow - 1;
        if (maxHRow > maxHeaderRow) {
            maxHeaderRow = maxHRow;
        }
    });
    var allColumns = [];
    validHeadersMap.forEach(function (grp) {
        return grp.forEach(function (h) {
            var c = h.column_index;
            if (allColumns.indexOf(c) > -1)
                return;
            allColumns.push(c);
        });
    });
    /**
     * @param {Number} colIndex
     * @param {Number} preColIndex
     *
     * @returns {Boolean}
     */
    function _addToIsland_(colIndex, preColIndex) {
        if (colIndex - preColIndex <= 1)
            return true;
        for (var x = preColIndex + 1; x < colIndex; x++) {
            if (allColumns.indexOf(x) > -1)
                return false;
        }
        return true;
    }
    /**
     * @param {SheetColumnNamedClusterHeader[]} headers
     *
     * @returns {SheetColumnNamedClusterHeader[][]} islands
     */
    function _getIslands_(headers) {
        var sortedHeaders = headers.sort(function (a, b) { return a.column_index - b.column_index; });
        var islands = [];
        var isl = [sortedHeaders[0]];
        var preColIndex = sortedHeaders[0].column_index;
        for (var i = 1; i < sortedHeaders.length; i++) {
            var h = sortedHeaders[i];
            var colIndex = h.column_index;
            if (_addToIsland_(colIndex, preColIndex)) {
                isl.push(h);
            }
            else {
                islands.push(isl);
                isl = [h];
            }
            preColIndex = colIndex;
        }
        islands.push(isl);
        return islands;
    }
    var knownIndexes = {};
    /**
     * @param {Number} rowIndex
     */
    function _getMatchingHeaders_(rowIndex) {
        if (rowIndex > maxHeaderRow)
            return;
        if (knownIndexes["" + rowIndex])
            return;
        var res = [];
        validHeadersMap.forEach(function (cls) {
            return cls.forEach(function (h) {
                if (h.row_index === rowIndex)
                    res.push(h);
            });
        });
        knownIndexes["" + rowIndex] = true;
        var islands = _getIslands_(res);
        result.push(islands);
    }
    validHeadersMap.forEach(function (cls) {
        return cls.forEach(function (h) {
            var i = h.row_index;
            _getMatchingHeaders_(i);
        });
    });
    var deduped = result.map(function (coll) {
        return coll.map(function (subColl) {
            var r = [];
            var m = {};
            subColl.forEach(function (v) {
                var key = v.row_index + "_" + v.column_index;
                if (m[key])
                    return;
                m[key] = true;
                r.push(v);
            });
            return r;
        });
    });
    return deduped;
}


/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
function validateTextForDisallowedBigQeryFieldPrefixes_(initial) {
    // https://cloud.google.com/bigquery/docs/schemas#column_names
    var disallowedPrefixes = [
        "_TABLE_",
        "_FILE_",
        "_PARTITION",
        "_ROW_TIMESTAMP",
        "__ROOT__",
        "_COLIDENTIFIER",
    ];
    var text = initial.suggested_value;
    var upper = text.toUpperCase();
    for (var index = 0; index < disallowedPrefixes.length; index++) {
        var element = disallowedPrefixes[index];
        if (upper.indexOf(element) === 0) {
            return {
                is_valid: false,
                suggested_value: null,
                message: "Field cannot start with " + element + " in BigQuery",
            };
        }
    }
    return {
        is_valid: true,
        message: "ok",
        suggested_value: text,
    };
}


/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
function validateForDatabaseReservedNamesList_(initial) {
    var word = initial.suggested_value;
    // https://dev.mysql.com/doc/refman/8.3/en/keywords.html
    var list = [
        "ACCESSIBLE",
        "ACCOUNT",
        "ACTION",
        "ACTIVE",
        "ADD",
        "ADMIN",
        "AFTER",
        "AGAINST",
        "AGGREGATE",
        "ALGORITHM",
        "ALL",
        "ALTER",
        "ALWAYS",
        "ANALYZE",
        "AND",
        "ANY",
        "ARRAY",
        "AS",
        "ASC",
        "ASCII",
        "ASENSITIVE",
        "AT",
        "ATTRIBUTE",
        "AUTHENTICATION",
        "AUTO_INCREMENT",
        "AUTOEXTEND_SIZE",
        "AVG",
        "AVG_ROW_LENGTH",
        "BACKUP",
        "BEFORE",
        "BEGIN",
        "BETWEEN",
        "BIGINT",
        "BINARY",
        "BINLOG",
        "BIT",
        "BLOB",
        "BLOCK",
        "BOOL",
        "BOOLEAN",
        "BOTH",
        "BTREE",
        "BUCKETS",
        "BULK",
        "BY",
        "BYTE",
        "CACHE",
        "CALL",
        "CASCADE",
        "CASCADED",
        "CASE",
        "CATALOG_NAME",
        "CHAIN",
        "CHALLENGE_RESPONSE",
        "CHANGE",
        "CHANGED",
        "CHANNEL",
        "CHAR",
        "CHARACTER",
        "CHARSET",
        "CHECK",
        "CHECKSUM",
        "CIPHER",
        "CLASS_ORIGIN",
        "CLIENT",
        "CLONE",
        "CLOSE",
        "COALESCE",
        "CODE",
        "COLLATE",
        "COLLATION",
        "COLUMN",
        "COLUMN_FORMAT",
        "COLUMN_NAME",
        "COLUMNS",
        "COMMENT",
        "COMMIT",
        "COMMITTED",
        "COMPACT",
        "COMPLETION",
        "COMPONENT",
        "COMPRESSED",
        "COMPRESSION",
        "CONCURRENT",
        "CONDITION",
        "CONNECTION",
        "CONSISTENT",
        "CONSTRAINT",
        "CONSTRAINT_CATALOG",
        "CONSTRAINT_NAME",
        "CONSTRAINT_SCHEMA",
        "CONTAINS",
        "CONTEXT",
        "CONTINUE",
        "CONVERT",
        "CPU",
        "CREATE",
        "CROSS",
        "CUBE",
        "CUME_DIST",
        "CURRENT",
        "CURRENT_DATE",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "CURRENT_USER",
        "CURSOR",
        "CURSOR_NAME",
        "DATA",
        "DATABASE",
        "DATABASES",
        "DATAFILE",
        "DATE",
        "DATETIME",
        "DAY",
        "DAY_HOUR",
        "DAY_MICROSECOND",
        "DAY_MINUTE",
        "DAY_SECOND",
        "DEALLOCATE",
        "DEC",
        "DECIMAL",
        "DECLARE",
        "DEFAULT",
        "DEFAULT_AUTH",
        "DEFINER",
        "DEFINITION",
        "DELAY_KEY_WRITE",
        "DELAYED",
        "DELETE",
        "DENSE_RANK",
        "DESC",
        "DESCRIBE",
        "DESCRIPTION",
        "DETERMINISTIC",
        "DIAGNOSTICS",
        "DIRECTORY",
        "DISABLE",
        "DISCARD",
        "DISK",
        "DISTINCT",
        "DISTINCTROW",
        "DIV",
        "DO",
        "DOUBLE",
        "DROP",
        "DUAL",
        "DUMPFILE",
        "DUPLICATE",
        "DYNAMIC",
        "EACH",
        "ELSE",
        "ELSEIF",
        "EMPTY",
        "ENABLE",
        "ENCLOSED",
        "ENCRYPTION",
        "END",
        "ENDS",
        "ENFORCED",
        "ENGINE",
        "ENGINE_ATTRIBUTE",
        "ENGINES",
        "ENUM",
        "ERROR",
        "ERRORS",
        "ESCAPE",
        "ESCAPED",
        "EVENT",
        "EVENTS",
        "EVERY",
        "EXCEPT",
        "EXCHANGE",
        "EXCLUDE",
        "EXECUTE",
        "EXISTS",
        "EXIT",
        "EXPANSION",
        "EXPIRE",
        "EXPLAIN",
        "EXPORT",
        "EXTENDED",
        "EXTENT_SIZE",
        "FACTOR",
        "FAILED_LOGIN_ATTEMPTS",
        "FALSE",
        "FAST",
        "FAULTS",
        "FETCH",
        "FIELDS",
        "FILE",
        "FILE_BLOCK_SIZE",
        "FILTER",
        "FINISH",
        "FIRST",
        "FIRST_VALUE",
        "FIXED",
        "FLOAT",
        "FLOAT4",
        "FLOAT8",
        "FLUSH",
        "FOLLOWING",
        "FOLLOWS",
        "FOR",
        "FORCE",
        "FOREIGN",
        "FORMAT",
        "FOUND",
        "FROM",
        "FULL",
        "FULLTEXT",
        "FUNCTION",
        "GENERAL",
        "GENERATE",
        "GENERATED",
        "GEOMCOLLECTION",
        "GEOMETRY",
        "GEOMETRYCOLLECTION",
        "GET",
        "GET_FORMAT",
        "GET_MASTER_PUBLIC_KEY",
        "GET_SOURCE_PUBLIC_KEY",
        "GLOBAL",
        "GRANT",
        "GRANTS",
        "GROUP",
        "GROUP_REPLICATION",
        "GROUPING",
        "GROUPS",
        "GTID_ONLY",
        "GTIDS",
        "HANDLER",
        "HASH",
        "HAVING",
        "HELP",
        "HIGH_PRIORITY",
        "HISTOGRAM",
        "HISTORY",
        "HOST",
        "HOSTS",
        "HOUR",
        "HOUR_MICROSECOND",
        "HOUR_MINUTE",
        "HOUR_SECOND",
        "IDENTIFIED",
        "IF",
        "IGNORE",
        "IGNORE_SERVER_IDS",
        "IMPORT",
        "IN",
        "INACTIVE",
        "INDEX",
        "INDEXES",
        "INFILE",
        "INITIAL",
        "INITIAL_SIZE",
        "INITIATE",
        "INNER",
        "INOUT",
        "INSENSITIVE",
        "INSERT",
        "INSERT_METHOD",
        "INSTALL",
        "INSTANCE",
        "INT",
        "INT1",
        "INT2",
        "INT3",
        "INT4",
        "INT8",
        "INTEGER",
        "INTERSECT",
        "INTERVAL",
        "INTO",
        "INVISIBLE",
        "INVOKER",
        "IO",
        "IO_AFTER_GTIDS",
        "IO_BEFORE_GTIDS",
        "IO_THREAD",
        "IPC",
        "IS",
        "ISOLATION",
        "ISSUER",
        "ITERATE",
        "JOIN",
        "JSON",
        "JSON_TABLE",
        "JSON_VALUE",
        "KEY",
        "KEY_BLOCK_SIZE",
        "KEYRING",
        "KEYS",
        "KILL",
        "LAG",
        "LANGUAGE",
        "LAST",
        "LAST_VALUE",
        "LATERAL",
        "LEAD",
        "LEADING",
        "LEAVE",
        "LEAVES",
        "LEFT",
        "LESS",
        "LEVEL",
        "LIKE",
        "LIMIT",
        "LINEAR",
        "LINES",
        "LINESTRING",
        "LIST",
        "LOAD",
        "LOCAL",
        "LOCALTIME",
        "LOCALTIMESTAMP",
        "LOCK",
        "LOCKED",
        "LOCKS",
        "LOG",
        "LOGFILE",
        "LOGS",
        "LONG",
        "LONGBLOB",
        "LONGTEXT",
        "LOOP",
        "LOW_PRIORITY",
        "MASTER",
        "MASTER_AUTO_POSITION",
        "MASTER_BIND",
        "MASTER_COMPRESSION_ALGORITHMS",
        "MASTER_CONNECT_RETRY",
        "MASTER_DELAY",
        "MASTER_HEARTBEAT_PERIOD",
        "MASTER_HOST",
        "MASTER_LOG_FILE",
        "MASTER_LOG_POS",
        "MASTER_PASSWORD",
        "MASTER_PORT",
        "MASTER_PUBLIC_KEY_PATH",
        "MASTER_RETRY_COUNT",
        "MASTER_SSL",
        "MASTER_SSL_CA",
        "MASTER_SSL_CAPATH",
        "MASTER_SSL_CERT",
        "MASTER_SSL_CIPHER",
        "MASTER_SSL_CRL",
        "MASTER_SSL_CRLPATH",
        "MASTER_SSL_KEY",
        "MASTER_SSL_VERIFY_SERVER_CERT",
        "MASTER_TLS_CIPHERSUITES",
        "MASTER_TLS_VERSION",
        "MASTER_USER",
        "MASTER_ZSTD_COMPRESSION_LEVEL",
        "MATCH",
        "MAX_CONNECTIONS_PER_HOUR",
        "MAX_QUERIES_PER_HOUR",
        "MAX_ROWS",
        "MAX_SIZE",
        "MAX_UPDATES_PER_HOUR",
        "MAX_USER_CONNECTIONS",
        "MAXVALUE",
        "MEDIUM",
        "MEDIUMBLOB",
        "MEDIUMINT",
        "MEDIUMTEXT",
        "MEMBER",
        "MEMORY",
        "MERGE",
        "MESSAGE_TEXT",
        "MICROSECOND",
        "MIDDLEINT",
        "MIGRATE",
        "MIN_ROWS",
        "MINUTE",
        "MINUTE_MICROSECOND",
        "MINUTE_SECOND",
        "MOD",
        "MODE",
        "MODIFIES",
        "MODIFY",
        "MONTH",
        "MULTILINESTRING",
        "MULTIPOINT",
        "MULTIPOLYGON",
        "MUTEX",
        "MYSQL_ERRNO",
        "NAME",
        "NAMES",
        "NATIONAL",
        "NATURAL",
        "NCHAR",
        "NDB",
        "NDBCLUSTER",
        "NESTED",
        "NETWORK_NAMESPACE",
        "NEVER",
        "NEW",
        "NEXT",
        "NO",
        "NO_WAIT",
        "NO_WRITE_TO_BINLOG",
        "NODEGROUP",
        "NONE",
        "NOT",
        "NOWAIT",
        "NTH_VALUE",
        "NTILE",
        "NULL",
        "NULLS",
        "NUMBER",
        "NUMERIC",
        "NVARCHAR",
        "OF",
        "OFF",
        "OFFSET",
        "OJ",
        "OLD",
        "ON",
        "ONE",
        "ONLY",
        "OPEN",
        "OPTIMIZE",
        "OPTIMIZER_COSTS",
        "OPTION",
        "OPTIONAL",
        "OPTIONALLY",
        "OPTIONS",
        "OR",
        "ORDER",
        "ORDINALITY",
        "ORGANIZATION",
        "OTHERS",
        "OUT",
        "OUTER",
        "OUTFILE",
        "OVER",
        "OWNER",
        "PACK_KEYS",
        "PAGE",
        "PARALLEL",
        "PARSE_TREE",
        "PARSER",
        "PARTIAL",
        "PARTITION",
        "PARTITIONING",
        "PARTITIONS",
        "PASSWORD",
        "PASSWORD_LOCK_TIME",
        "PATH",
        "PERCENT_RANK",
        "PERSIST",
        "PERSIST_ONLY",
        "PHASE",
        "PLUGIN",
        "PLUGIN_DIR",
        "PLUGINS",
        "POINT",
        "POLYGON",
        "PORT",
        "PRECEDES",
        "PRECEDING",
        "PRECISION",
        "PREPARE",
        "PRESERVE",
        "PREV",
        "PRIMARY",
        "PRIVILEGE_CHECKS_USER",
        "PRIVILEGES",
        "PROCEDURE",
        "PROCESS",
        "PROCESSLIST",
        "PROFILE",
        "PROFILES",
        "PROXY",
        "PURGE",
        "QUALIFY",
        "QUARTER",
        "QUERY",
        "QUICK",
        "RANDOM",
        "RANGE",
        "RANK",
        "READ",
        "READ_ONLY",
        "READ_WRITE",
        "READS",
        "REAL",
        "REBUILD",
        "RECOVER",
        "RECURSIVE",
        "REDO_BUFFER_SIZE",
        "REDUNDANT",
        "REFERENCE",
        "REFERENCES",
        "REGEXP",
        "REGISTRATION",
        "RELAY",
        "RELAY_LOG_FILE",
        "RELAY_LOG_POS",
        "RELAY_THREAD",
        "RELAYLOG",
        "RELEASE",
        "RELOAD",
        "REMOVE",
        "RENAME",
        "REORGANIZE",
        "REPAIR",
        "REPEAT",
        "REPEATABLE",
        "REPLACE",
        "REPLICA",
        "REPLICAS",
        "REPLICATE_DO_DB",
        "REPLICATE_DO_TABLE",
        "REPLICATE_IGNORE_DB",
        "REPLICATE_IGNORE_TABLE",
        "REPLICATE_REWRITE_DB",
        "REPLICATE_WILD_DO_TABLE",
        "REPLICATE_WILD_IGNORE_TABLE",
        "REPLICATION",
        "REQUIRE",
        "REQUIRE_ROW_FORMAT",
        "RESET",
        "RESIGNAL",
        "RESOURCE",
        "RESPECT",
        "RESTART",
        "RESTORE",
        "RESTRICT",
        "RESUME",
        "RETAIN",
        "RETURN",
        "RETURNED_SQLSTATE",
        "RETURNING",
        "RETURNS",
        "REUSE",
        "REVERSE",
        "REVOKE",
        "RIGHT",
        "RLIKE",
        "ROLE",
        "ROLLBACK",
        "ROLLUP",
        "ROTATE",
        "ROUTINE",
        "ROW",
        "ROW_COUNT",
        "ROW_FORMAT",
        "ROW_NUMBER",
        "ROWS",
        "RTREE",
        "S3",
        "SAVEPOINT",
        "SCHEDULE",
        "SCHEMA",
        "SCHEMA_NAME",
        "SCHEMAS",
        "SECOND",
        "SECOND_MICROSECOND",
        "SECONDARY",
        "SECONDARY_ENGINE",
        "SECONDARY_ENGINE_ATTRIBUTE",
        "SECONDARY_LOAD",
        "SECONDARY_UNLOAD",
        "SECURITY",
        "SELECT",
        "SENSITIVE",
        "SEPARATOR",
        "SERIAL",
        "SERIALIZABLE",
        "SERVER",
        "SESSION",
        "SET",
        "SHARE",
        "SHOW",
        "SHUTDOWN",
        "SIGNAL",
        "SIGNED",
        "SIMPLE",
        "SKIP",
        "SLAVE",
        "SLOW",
        "SMALLINT",
        "SNAPSHOT",
        "SOCKET",
        "SOME",
        "SONAME",
        "SOUNDS",
        "SOURCE",
        "SOURCE_AUTO_POSITION",
        "SOURCE_BIND",
        "SOURCE_COMPRESSION_ALGORITHMS",
        "SOURCE_CONNECT_RETRY",
        "SOURCE_DELAY",
        "SOURCE_HEARTBEAT_PERIOD",
        "SOURCE_HOST",
        "SOURCE_LOG_FILE",
        "SOURCE_LOG_POS",
        "SOURCE_PASSWORD",
        "SOURCE_PORT",
        "SOURCE_PUBLIC_KEY_PATH",
        "SOURCE_RETRY_COUNT",
        "SOURCE_SSL",
        "SOURCE_SSL_CA",
        "SOURCE_SSL_CAPATH",
        "SOURCE_SSL_CERT",
        "SOURCE_SSL_CIPHER",
        "SOURCE_SSL_CRL",
        "SOURCE_SSL_CRLPATH",
        "SOURCE_SSL_KEY",
        "SOURCE_SSL_VERIFY_SERVER_CERT",
        "SOURCE_TLS_CIPHERSUITES",
        "SOURCE_TLS_VERSION",
        "SOURCE_USER",
        "SOURCE_ZSTD_COMPRESSION_LEVEL",
        "SPATIAL",
        "SPECIFIC",
        "SQL",
        "SQL_AFTER_GTIDS",
        "SQL_AFTER_MTS_GAPS",
        "SQL_BEFORE_GTIDS",
        "SQL_BIG_RESULT",
        "SQL_BUFFER_RESULT",
        "SQL_CALC_FOUND_ROWS",
        "SQL_NO_CACHE",
        "SQL_SMALL_RESULT",
        "SQL_THREAD",
        "SQL_TSI_DAY",
        "SQL_TSI_HOUR",
        "SQL_TSI_MINUTE",
        "SQL_TSI_MONTH",
        "SQL_TSI_QUARTER",
        "SQL_TSI_SECOND",
        "SQL_TSI_WEEK",
        "SQL_TSI_YEAR",
        "SQLEXCEPTION",
        "SQLSTATE",
        "SQLWARNING",
        "SRID",
        "SSL",
        "STACKED",
        "START",
        "STARTING",
        "STARTS",
        "STATS_AUTO_RECALC",
        "STATS_PERSISTENT",
        "STATS_SAMPLE_PAGES",
        "STATUS",
        "STOP",
        "STORAGE",
        "STORED",
        "STRAIGHT_JOIN",
        "STREAM",
        "STRING",
        "SUBCLASS_ORIGIN",
        "SUBJECT",
        "SUBPARTITION",
        "SUBPARTITIONS",
        "SUPER",
        "SUSPEND",
        "SWAPS",
        "SWITCHES",
        "SYSTEM",
        "TABLE",
        "TABLE_CHECKSUM",
        "TABLE_NAME",
        "TABLES",
        "TABLESPACE",
        "TEMPORARY",
        "TEMPTABLE",
        "TERMINATED",
        "TEXT",
        "THAN",
        "THEN",
        "THREAD_PRIORITY",
        "TIES",
        "TIME",
        "TIMESTAMP",
        "TIMESTAMPADD",
        "TIMESTAMPDIFF",
        "TINYBLOB",
        "TINYINT",
        "TINYTEXT",
        "TLS",
        "TO",
        "TRAILING",
        "TRANSACTION",
        "TRIGGER",
        "TRIGGERS",
        "TRUE",
        "TRUNCATE",
        "TYPE",
        "TYPES",
        "UNBOUNDED",
        "UNCOMMITTED",
        "UNDEFINED",
        "UNDO",
        "UNDO_BUFFER_SIZE",
        "UNDOFILE",
        "UNICODE",
        "UNINSTALL",
        "UNION",
        "UNIQUE",
        "UNKNOWN",
        "UNLOCK",
        "UNREGISTER",
        "UNSIGNED",
        "UNTIL",
        "UPDATE",
        "UPGRADE",
        "URL",
        "USAGE",
        "USE",
        "USE_FRM",
        "USER",
        "USER_RESOURCES",
        "USING",
        "UTC_DATE",
        "UTC_TIME",
        "UTC_TIMESTAMP",
        "VALIDATION",
        "VALUE",
        "VALUES",
        "VARBINARY",
        "VARCHAR",
        "VARCHARACTER",
        "VARIABLES",
        "VARYING",
        "VCPU",
        "VIEW",
        "VIRTUAL",
        "VISIBLE",
        "WAIT",
        "WARNINGS",
        "WEEK",
        "WEIGHT_STRING",
        "WHEN",
        "WHERE",
        "WHILE",
        "WINDOW",
        "WITH",
        "WITHOUT",
        "WORK",
        "WRAPPER",
        "WRITE",
        "X509",
        "XA",
        "XID",
        "XML",
        "XOR",
        "YEAR",
        "YEAR_MONTH",
        "ZEROFILL",
        "ZONE",
    ];
    var upper = word.toUpperCase();
    if (list.indexOf(upper) > -1) {
        initial.suggested_value = word + "_";
        return validateForDatabaseReservedNamesList_(initial);
    }
    return {
        is_valid: true,
        message: "ok",
        suggested_value: word,
    };
}


/**
 * @param {ValidatedStringValueResponse} initial
 *
 * @returns {ValidatedStringValueResponse}
 */
function validateMaxBigQueryFieldChars_(initial) {
    var maxChars = 300;
    return validateTextMaximumLength_(initial, maxChars);
}
/**
 * @param {ValidatedStringValueResponse} initial
 * @param {number} maxChars
 *
 * @returns {ValidatedStringValueResponse}
 */
function validateTextMaximumLength_(initial, maxChars) {
    var text = initial.suggested_value;
    if (text.length > maxChars) {
        return {
            is_valid: false,
            suggested_value: null,
            message: "Value is longer than maximum allowed " + maxChars + " chars.",
        };
    }
    return {
        is_valid: true,
        suggested_value: text,
        message: "ok",
    };
}

/**
 * @typedef {Object} GetSerialNameOptions
 * @prop {String[]} [other_names]
 * @prop {Boolean} [case_insensitive] - defaults `false`
 * @prop {String} [prefix]
 * @prop {String} [postfix]
 * @prop {Number|null} [chars_limit] - null if no given
 * @prop {Number} [start_index] - defaults to 1, start count from..
 */
/**
 * @typedef {Object} GetSerialNameResponse
 * @prop {String|null} name
 * @prop {Boolean} is_valid
 * @prop {String} [message]
 */
/**
 * @param {String} name
 * @param {GetSerialNameOptions} [options]
 *
 * @returns {GetSerialNameResponse}
 */
function getSerialName_(name, options) {
    return getSerialNameRecousive_(name, options, null);
}
/**
 * @param {String} name
 * @param {GetSerialNameOptions} [options]
 * @param {String|null} [originalName] - only used inside the function
 *
 * @returns {GetSerialNameResponse}
 */
function getSerialNameRecousive_(name, options, originalName) {
    /**
     * @param {String} message
     * @returns {GetSerialNameResponse}
     */
    function _same(message) {
        return {
            is_valid: true,
            message: message,
            name: name,
        };
    }
    if (!options) {
        return _same("With no options given the result is the same");
    }
    if (!options.other_names) {
        return _same("With no other names given the result is the same");
    }
    if (!options.other_names.length) {
        return _same("With other names empty the result is the same");
    }
    if (options.chars_limit) {
        if (name.length > options.chars_limit) {
            return {
                is_valid: false,
                name: null,
                message: "Name length is > " + options.chars_limit + " chars.",
            };
        }
    }
    /**
     * @param {String} value
     * @param {String} value2
     * @returns {Boolean}
     */
    function _isSameString_(value, value2) {
        if (options.case_insensitive) {
            return value === value2;
        }
        return value.toLowerCase() === value2.toLowerCase();
    }
    var startIndex = options.start_index || 1;
    var prefix = options.prefix || "";
    var postfix = options.postfix || "";
    originalName = originalName || name;
    for (var i = 0; i < options.other_names.length; i++) {
        if (_isSameString_(name, options.other_names[i])) {
            name = originalName + prefix + startIndex + postfix;
            options.start_index = startIndex + 1;
            return getSerialNameRecousive_(name, options, originalName);
        }
    }
    return _same("No conflicting names found");
}


/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
function validateDatabaseValueForDuplicates_(initial) {
    var text = initial.suggested_value;
    var list = initial.previous_values;
    var sameNamesValidation = getSerialName_(text, {
        other_names: list,
        prefix: "_",
    });
    if (!sameNamesValidation.is_valid) {
        return {
            is_valid: false,
            suggested_value: null,
            message: sameNamesValidation.message,
        };
    }
    return {
        is_valid: true,
        suggested_value: sameNamesValidation.name,
        message: "ok",
    };
}


/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
function validateFieldNameAllowedDatabaseChars_(initial) {
    var text = initial.suggested_value;
    var allowedCharsTest = /^[A-Za-z0-9_]*$/.test(text);
    if (allowedCharsTest) {
        return {
            is_valid: true,
            suggested_value: text,
            message: "ok",
        };
    }
    var spaceReplacedLovercase = text.toLowerCase().replace(/ /g, "_");
    var invalidChars = spaceReplacedLovercase.replace(/[A-Za-z0-9_]/g, "");
    var validString = spaceReplacedLovercase.replace(/[^A-Za-z0-9_]/g, "");
    if (validString.length < invalidChars.length) {
        return {
            is_valid: false,
            suggested_value: null,
            message: "Given column name is too broad and contains more than a half invalid field name chars.",
        };
    }
    return {
        is_valid: true,
        suggested_value: validString,
        message: "Transformed given text to valid field name",
    };
}


/**
 * @param {ValidatedStringValueResponse} initial
 * @returns {ValidatedStringValueResponse}
 */
function validateDataBaseStringStartsWith_(initial) {
    var text = initial.suggested_value;
    if (!/[a-z_]/i.test(text)) {
        return {
            is_valid: false,
            message: "Provided text has no letters and no underscore",
            suggested_value: null,
        };
    }
    if (/^[0-9].*/.test(text)) {
        text = "_" + text;
    }
    return {
        is_valid: true,
        message: "ok",
        suggested_value: text,
    };
}


/**
 * @returns {ValidHeaderRule[]}
 */
function getBigQueryFieldNamingRules_() {
    return [
        {
            key: "starts with",
            description: "A column name must start with a letter or underscore",
            test_function: validateDataBaseStringStartsWith_,
            message: "A column name must start with a letter or underscore",
        },
        {
            key: "allowed chars",
            description: "A column name can contain letters (a-z, A-Z), numbers (0-9), or underscores (_), Use lower case and `_` convention",
            test_function: validateFieldNameAllowedDatabaseChars_,
        },
        {
            key: "bigquery prefix",
            description: "Column names can't use any of the following prefixes: _TABLE_, _FILE_, _PARTITION, _ROW_TIMESTAMP, __ROOT__, _COLIDENTIFIER",
            test_function: validateTextForDisallowedBigQeryFieldPrefixes_,
        },
        {
            key: "reserved keywords",
            description: "Column name cannot be reserved kayword",
            test_function: validateForDatabaseReservedNamesList_,
        },
        {
            key: "duplicates",
            description: "Duplicate column names are not allowed even if the case differs.",
            test_function: validateDatabaseValueForDuplicates_,
        },
        {
            key: "max length",
            description: "Column names have a maximum length of 300 characters",
            test_function: validateMaxBigQueryFieldChars_,
        },
    ];
}

/**
 * @typedef {Object} ValidatedStringValueResponse
 * @prop {String|null} suggested_value
 * @prop {Boolean} is_valid
 * @prop {String} [message]
 * @prop {String} [original_value]
 * @prop {String[]} [previous_values]
 */
/**
 * @typedef {Object} ValidHeaderRule
 * @prop {String} key
 * @prop {Function} test_function
 * @prop {String} [description]
 * @prop {String} [message] - optional extra message for rule.
 */
/**
 * @typedef {Object} ValidatedStringValueOptions
 * @prop {ValidHeaderRule[]} rules
 * @prop {String[]} previous_values
 */
/**
 * Checks all rules
 * вљ пёЏRules order matters as some rules modofy value
 * @param {String} value
 * @param {ValidatedStringValueOptions} [options]
 *
 * @returns {ValidatedStringValueResponse}
 */
function getValidDatabaseFieldName_(value, options) {
    /**
     * @param {String} message
     * @returns {ValidatedStringValueResponse}
     */
    function _okSame(message) {
        return {
            is_valid: true,
            suggested_value: value,
            message: message,
            original_value: value,
        };
    }
    /**
     * @param {String} message
     * @param {String} [extra_message]
     * @returns {ValidatedStringValueResponse}
     */
    function _invalid(message, extra_message) {
        if (extra_message)
            message += ". " + extra_message;
        return {
            is_valid: false,
            suggested_value: null,
            message: message,
            original_value: value,
        };
    }
    if (!options)
        return _okSame("No options provided");
    if (!options.rules)
        return _okSame("No rules to check provided");
    if (!options.rules.length)
        return _okSame("Rules provided are empty");
    var result = _okSame("Rules are passed, use same name");
    function setResultDefaults_() {
        if (options.previous_values) {
            // @ts-ignore
            result.previous_values = options.previous_values;
        }
        result.original_value = value;
    }
    for (var index = 0; index < options.rules.length; index++) {
        var rule = options.rules[index];
        if (!rule) {
            throw new Error("Cannot validate with null or empty rule");
        }
        if (!rule.test_function) {
            throw new Error("Rule test function is not provided or null");
        }
        if (typeof rule.test_function !== "function") {
            throw new Error("Rule test function is not a function");
        }
        setResultDefaults_();
        result = rule.test_function(result);
        if (!result.is_valid)
            return _invalid(result.message, rule.message);
    }
    return result;
}



/**
 * @param {String} name
 * @param {String[]} [previousNames]
 *
 * @returns {ValidatedStringValueResponse}
 */
function getBigQueryValidatedFieldName_(name, previousNames) {
    var rules = getBigQueryFieldNamingRules_();
    /** @type {ValidatedStringValueOptions} */
    var options = {
        previous_values: previousNames,
        rules: rules,
    };
    var result = getValidDatabaseFieldName_(name, options);
    result.original_value = name;
    return result;
}




/**
 * @typedef {Object} SheetColumnNamedClusterHeader
 * @prop {ValidatedStringValueResponse} header_response
 * @prop {Number} row_index
 * @prop {Number} column_index
 */
/**
 * @param {RangeValues} values
 * @param {SheetsValuesColumnCluster} cluster
 *
 * @returns {SheetColumnNamedClusterHeader[]}
 */
function getPossibleColumnClusterHeaders_(values, cluster) {
    /** @type {SheetColumnNamedClusterHeader[]} */
    var result = [];
    if (!cluster)
        return result;
    if (cluster.type === "null")
        return result;
    if (cluster.string_like_type === "null")
        return result;
    var lastHeaderSearchIndex = cluster.start_index - 1;
    if (cluster.string_like_type === "string") {
        lastHeaderSearchIndex = cluster.end_index - 1;
    }
    if (lastHeaderSearchIndex < 0)
        return result;
    /**
     * @param {*} value
     * @param {Number} index
     */
    function _addPossibleHeader_(value, index) {
        if (typeof value !== "string")
            return;
        var headerResponse = getBigQueryValidatedFieldName_(value, []);
        result.push({
            header_response: headerResponse,
            row_index: index,
            column_index: cluster.column_index,
        });
    }
    for (var i = 0; i <= lastHeaderSearchIndex; i++) {
        var value = values[i][cluster.column_index];
        _addPossibleHeader_(value, i);
    }
    return result;
}


/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/

/**
 * @typedef {Object} AllClustersHeadersResponse
 * @prop {SheetColumnNamedClusterHeader[][]} headers_map
 * @prop {SheetColumnNamedClusterHeader[][]} valid_headers_map
 */
/**
 * @typedef {ClustersRowStartsFitCheckResponse & AllClustersHeadersResponse} PossibleSchemaClustersInfo
 */
/**
 * Adds master cluster to the list
 * @param {ClustersRowStartsFitCheckResponse} fitInfo
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {PossibleSchemaClustersInfo}
 */
function getAllMatchedColumnValueClutersHeaders_(fitInfo, info) {
    if (!fitInfo)
        return null;
    var headersMap = [];
    var validHeadersMap = [];
    var clustersRowFit = fitInfo.clusters_rows_fit.concat(info.master_cluster);
    var possibleRowsMap = fitInfo.possible_rows_map.concat([
        info.master_rows_possible_start,
    ]);
    var foundHeaderColumns = [];
    for (var i = 0; i < clustersRowFit.length; i++) {
        var headers = getPossibleColumnClusterHeaders_(info.values, clustersRowFit[i]);
        var validHaders = headers.filter(function (header) { return header.header_response.is_valid; });
        headersMap.push(headers);
        if (validHaders.length) {
            validHeadersMap.push(validHaders);
            foundHeaderColumns.push(validHaders[0].column_index);
        }
    }
    var headerClusters = [];
    var startingRowsFit = [];
    clustersRowFit.forEach(function (cls, i) {
        var column = cls.column_index;
        if (foundHeaderColumns.indexOf(column) === -1) {
            return;
        }
        headerClusters.push(cls);
        startingRowsFit.push(possibleRowsMap[i]);
    });
    return {
        clusters_rows_fit: headerClusters,
        possible_rows_map: startingRowsFit,
        headers_map: headersMap,
        valid_headers_map: validHeadersMap,
    };
}



/**
 * @param {ClustersRowStartsFitCheckResponse} fittingInfo
 * @param {SheetsValuesColumnCluster} masterCluster
 * @param {Number} maxColumnGap
 *
 * @returns {ClustersRowStartsFitCheckResponse}
 */
function reduceFittingClustersByMaxColumnGap_(fittingInfo, masterCluster, maxColumnGap) {
    if (!masterCluster)
        return null;
    var fittingClusters = [];
    var possibleRows = [];
    var startingColumn = masterCluster.column_index;
    var allColumns = fittingInfo.clusters_rows_fit.map(function (cls) { return cls.column_index; });
    var correctColumnIndexes = [];
    var gap = 0;
    /**
     * @param {Number} columnIndex
     * @returns {Boolean} break
     */
    function _break_(columnIndex) {
        gap++;
        if (allColumns.indexOf(columnIndex) > -1) {
            gap = 0;
            correctColumnIndexes.push(columnIndex);
        }
        if (gap > maxColumnGap)
            return true;
        return false;
    }
    for (var i = startingColumn - 1; i >= 0; i--) {
        if (_break_(i))
            break;
    }
    gap = 0;
    for (var i = startingColumn + 1; i <= Math.max.apply(Math, allColumns); i++) {
        if (_break_(i))
            break;
    }
    fittingInfo.clusters_rows_fit.forEach(function (cls, i) {
        if (correctColumnIndexes.indexOf(cls.column_index) === -1)
            return;
        fittingClusters.push(cls);
        possibleRows.push(fittingInfo.possible_rows_map[i]);
    });
    return {
        clusters_rows_fit: fittingClusters,
        possible_rows_map: possibleRows,
    };
}


/**
 * @typedef {Object} ClustersFirstRowsFitEdgeCasesResponse
 * @prop {Boolean} mismatch
 * @prop {String} [message]
 */
/**
 * @param {SheetsValuesColumnCluster} cluster1 - master cluster
 * @param {SheetsValuesColumnCluster} cluster2
 *
 * @returns {ClustersFirstRowsFitEdgeCasesResponse}
 */
function check2ClustersFirstRowsEdgeCases_(cluster1, cluster2) {
    /**
     * @param {String} message
     * @returns {ClustersFirstRowsFitEdgeCasesResponse}
     */
    function _mismatch_(message) {
        return {
            mismatch: true,
            message: message,
        };
    }
    if (cluster1.start_index >= cluster2.end_index) {
        return _mismatch_("Master-cluster is below Check-cluster");
    }
    if (cluster2.start_index >= cluster1.end_index) {
        return _mismatch_("Check-cluster is below Master-cluster");
    }
    return { mismatch: false, message: "ok" };
}



/**
 * @param {SheetsValuesColumnCluster} cluster
 * @param {RangeValues} values
 * @param {Number} [maxNonStringStartOffset]
 * @param {Number} [maxPercentStringStartOffset]
 *
 * @returns {Number[]}
 */
function getColumnValuesClusterPossibleRowsStart_(cluster, values, maxNonStringStartOffset, maxPercentStringStartOffset) {
    if (maxNonStringStartOffset === void 0) { maxNonStringStartOffset = 0; }
    var rowsPossibleStart = [];
    if (!cluster)
        return rowsPossibleStart;
    var endIndex = cluster.start_index + maxNonStringStartOffset;
    if (cluster.string_like_type === "string") {
        // with string type evety cell inside can be a header
        endIndex = cluster.end_index - 1;
        if (maxPercentStringStartOffset > 0) {
            var rowsLen = cluster.end_index - cluster.start_index + 1;
            var stringOffset = Math.floor(rowsLen * maxPercentStringStartOffset);
            var minusOffset = rowsLen - stringOffset;
            var newEnd = cluster.end_index - minusOffset;
            if (newEnd < endIndex && newEnd > cluster.start_index) {
                endIndex = newEnd;
            }
        }
    }
    /**
     * @param {Number} rowIndex
     * @returns {Boolean} stop this function
     *
     */
    function _add_(rowIndex) {
        if (rowIndex >= cluster.start_index) {
            rowsPossibleStart.push(rowIndex);
            return false;
        }
        var value = values[rowIndex][cluster.column_index];
        if (value !== "")
            return true;
        rowsPossibleStart.push(rowIndex);
        return false;
    }
    // we cannot start data from first row as it should have headers
    // so we loop until index >= 1
    for (var rowIndex = endIndex; rowIndex >= 1; rowIndex--) {
        if (_add_(rowIndex))
            return rowsPossibleStart;
    }
    return rowsPossibleStart;
}



/**
 * @typedef {Object} ClustersRowStartsFitCheckResponse
 * @prop {Boolean} fits
 * @prop {String} [message]
 * @prop {Number[]} [rows_possible_start]
 */
/**
 *
 * @param {FitColumnValuesClustersInfo} info
 * @param {SheetsValuesColumnCluster} cluster2
 *
 * @returns {ClustersRowStartsFitCheckResponse}
 */
function check2ClustersRowsFit_(info, cluster2) {
    var cluster1 = info.master_cluster;
    /**
     * @prop {String} message
     * @returns {ClustersRowStartsFitCheckResponse}
     */
    function _nullResponse_(message) {
        return {
            fits: false,
            message: message,
        };
    }
    var edgeCases = check2ClustersFirstRowsEdgeCases_(cluster1, cluster2);
    if (edgeCases.mismatch)
        return _nullResponse_(edgeCases.message);
    var possibleRowsStart2 = getColumnValuesClusterPossibleRowsStart_(cluster2, info.values, info.options.max_row_start_offset, info.options.max_row_start_string_rows_percent);
    var possibleRowsStart1 = info.master_rows_possible_start;
    var possibleRowsStart = [];
    for (var i = 0; i < possibleRowsStart2.length; i++) {
        var rowIndex = possibleRowsStart2[i];
        if (possibleRowsStart1.indexOf(rowIndex) > -1) {
            possibleRowsStart.push(rowIndex);
        }
    }
    if (possibleRowsStart.length === 0) {
        return _nullResponse_("No common rows to start data with");
    }
    return {
        fits: true,
        message: "ok",
        rows_possible_start: possibleRowsStart,
    };
}



/**
 * @typedef {Object} ClustersRowStartsFitCheckResponse
 * @prop {SheetsValuesColumnCluster[]} clusters_rows_fit
 * @prop {Number[][]} possible_rows_map
 */
/**
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {ClustersRowStartsFitCheckResponse}
 */
function getColumnValueClustersRowFit_(info) {
    var clusters = [];
    var rows = [];
    /**
     * @param {SheetsValuesColumnCluster} cluster
     */
    function _addFittingCluster_(cluster) {
        if (cluster.column_index === info.master_cluster.column_index) {
            // do not check master cluster column
            return;
        }
        var test = check2ClustersRowsFit_(info, cluster);
        if (!test.fits)
            return;
        clusters.push(cluster);
        // @ts-ignore
        rows.push(test.rows_possible_start);
    }
    for (var i = 0; i < info.clusters.length; i++) {
        for (var ii = 0; ii < info.clusters[i].length; ii++) {
            _addFittingCluster_(info.clusters[i][ii]);
        }
    }
    var rowsFit = {
        clusters_rows_fit: clusters,
        possible_rows_map: rows,
    };
    return rowsFit;
}




/**
 * @typedef {Object} FitColumnValuesClustersOptions
 * @prop {Number} max_row_start_offset - number of rows we can skip assuming it is subtotals
 * @prop {Number} max_row_start_string_rows_percent - max percent on rows in depth for string clusters
 * @prop {Number} max_skipped_columns - max number of skipped columns between clusters
 * @prop {Number} max_values_crop - max average rounded values allowed to crop after other cluster
 * @prop {Number} max_header_lenght - 300 https://cloud.google.com/bigquery/docs/schemas
 */
/**
 * @typedef {Object} FitColumnValuesClustersInfo
 * @prop {SheetsValuesColumnCluster} master_cluster
 * @prop {FitColumnValuesClustersOptions} options
 * @prop {RangeValues} values
 * @prop {SheetsValuesColumnCluster[][]} clusters
 * @prop {Number[]} master_rows_possible_start
 * @prop {SheetColumnNamedClusterHeader[]} master_possible_headers
 */
/**
 * @returns {FitColumnValuesClustersOptions}
 */
function getFitValuesClustersOptions_() {
    return {
        max_row_start_offset: 2,
        max_row_start_string_rows_percent: 0.3,
        max_skipped_columns: 1,
        max_values_crop: 1,
        max_header_lenght: 300,
    };
}
/**
 * @param {SheetsValuesColumnCluster} masterCluster
 * @param {RangeValues} values
 * @param {SheetsValuesColumnCluster[][]} clusters
 *
 * @returns {FitColumnValuesClustersInfo}
 */
function getInitialFitColumnValuesClustersInfo_(masterCluster, values, clusters) {
    var headers = getPossibleColumnClusterHeaders_(values, masterCluster);
    var options = getFitValuesClustersOptions_();
    var possibleRowsStart = getColumnValuesClusterPossibleRowsStart_(masterCluster, values, options.max_row_start_offset, options.max_row_start_string_rows_percent);
    return {
        master_cluster: masterCluster,
        options: options,
        values: values,
        master_rows_possible_start: possibleRowsStart,
        master_possible_headers: headers,
        clusters: clusters,
    };
}


/**
 * @typedef {Object} BestValuesClusterResponse
 * @prop {SheetsValuesColumnCluster|null} best_cluster
 * @prop {Number|null} best_cluster_index
 */
/**
 * Finding the longest cluster
 * Trying to find not sring-type cluster
 * Returns the first cluster meeting conditions
 *
 * @param {SheetsValuesColumnCluster[][]} clustersMap
 * @param {Object} [skipClusters] {"1": [0]} column: cluster indexes
 *
 * @returns {BestValuesClusterResponse}
 */
function findNextBestFitValuesCluster_(clustersMap, skipClusters) {
    var maxLength = 0;
    var currentLength = 0;
    /** @type {SheetsValuesColumnCluster} */
    var cluster;
    /** @type {SheetsValuesColumnCluster} */
    var bestCluster = null;
    /** @type {Number|null} */
    var resultIndex = null;
    /**
     * @param {Number} columnIndex
     * @param {Number} clusterIndex
     * @returns {Boolean}
     */
    function _skipThisCluster_(columnIndex, clusterIndex) {
        if (!skipClusters)
            return false;
        /** @type {Number[]} */
        var clusterIndexes = skipClusters["" + columnIndex];
        if (!clusterIndexes)
            return false;
        if (!clusterIndexes.length)
            return false;
        return clusterIndexes.indexOf(clusterIndex) > -1;
    }
    /**
     * @param {SheetsValuesColumnCluster} cluster
     * @param {Number} index
     */
    function _setBestCluster(cluster, index) {
        bestCluster = cluster;
        resultIndex = index;
    }
    /**
     * @param {SheetsValuesColumnCluster} cluster
     * @param {Number} columnIndex
     * @param {Number} clusterIndex
     */
    function _checkBestCluster_(cluster, columnIndex, clusterIndex) {
        if (_skipThisCluster_(columnIndex, clusterIndex)) {
            return;
        }
        if (!bestCluster)
            _setBestCluster(cluster, clusterIndex);
        currentLength = cluster.end_index - cluster.start_index;
        if (currentLength < maxLength) {
            return false;
        }
        else if (currentLength > maxLength) {
            _setBestCluster(cluster, clusterIndex);
            maxLength = currentLength;
            return;
        }
        if (bestCluster.type !== "string")
            return;
        if (cluster.type !== "string") {
            _setBestCluster(cluster, clusterIndex);
            return;
        }
        if (bestCluster.string_like_type !== "string")
            return;
        if (cluster.string_like_type !== "string") {
            _setBestCluster(cluster, clusterIndex);
        }
    }
    for (var i = 0; i < clustersMap.length; i++) {
        // we are in column
        for (var ii = 0; ii < clustersMap[i].length; ii++) {
            cluster = clustersMap[i][ii];
            _checkBestCluster_(cluster, i, ii);
        }
    }
    return {
        best_cluster: bestCluster,
        best_cluster_index: resultIndex,
    };
}

/**
 * @typedef {Object} ColumnsValuesClusterValidation
 * @prop {Boolean} is_valid
 * @prop {String} message
 */

/**
 *
 * @param {SheetsValuesColumnCluster} cluster
 *
 * @returns {ColumnsValuesClusterValidation}
 */
function validateColumnValuesCluster_(cluster) {
    /**
     * @param {String} message
     * @returns {ColumnsValuesClusterValidation}
     */
    function _notValid(message) {
        return {
            is_valid: false,
            message: message,
        };
    }
    if (cluster.type === "null") {
        return _notValid("Cluster type is null");
    }
    if (cluster.string_like_type === "null") {
        return _notValid("Cluster type is empty string");
    }
    if (cluster.start_index === 0 && cluster.string_like_type !== "string") {
        return _notValid("Cluster have no header");
    }
    return {
        is_valid: true,
        message: "ok",
    };
}



/**
 * @typedef {Object} SheetsValuesColumnCluster
 * @prop {BasicDataType} type
 * @prop {BasicDataType} [string_like_type]
 * @prop {Number} start_index
 * @prop {Number} end_index
 * @prop {Number} [max_size]
 * @prop {Number} [max_precision]
 * @prop {Number} [max_scale]
 * @prop {Number} [column_index]
 * @prop {Number[]} [indexes_null]
 * @prop {Number} [position]
 */
/**
 * @constructor
 *
 * @param {TypeCheckResult} iniTypeInfo
 * @param {Number} index
 * @param {Number} [columnIndex]
 */
function ColumnClusterType_(iniTypeInfo, index, columnIndex) {
    var self = this;
    var currentIndex = index - 1;
    /** @type {SheetsValuesColumnCluster} */
    self.info = {
        type: iniTypeInfo.type,
        string_like_type: iniTypeInfo.string_like_type,
        start_index: index,
        end_index: index,
        max_scale: 0,
        max_precision: 0,
        max_size: 0,
        indexes_null: [],
        column_index: columnIndex,
    };
    /**
     * @method
     * @param {TypeCheckResult} typeInfo
     * @param {Boolean} [isNull]
     */
    self.addItem = function (typeInfo, isNull) {
        currentIndex++;
        if (isNull) {
            self.info.indexes_null.push(currentIndex);
            return;
        }
        self.info.end_index = currentIndex;
        if (typeInfo.scale > self.info.max_scale) {
            self.info.max_scale = typeInfo.scale;
        }
        if (typeInfo.precision > self.info.max_precision) {
            self.info.max_precision = typeInfo.precision;
        }
        if (typeInfo.size > self.info.max_size) {
            self.info.max_size = typeInfo.size;
        }
    };
    /**
     * @method
     * @param {Number} [position]
     * @returns {SheetsValuesColumnCluster}
     */
    self.getInfo = function (position) {
        self.info.indexes_null = self.info.indexes_null.filter(function (elt) { return elt <= self.info.end_index; });
        if (position !== undefined && position !== null)
            self.info.position = position;
        return self.info;
    };
    self.validate = function () {
        return validateColumnValuesCluster_(self.getInfo());
    };
    self.addItem(iniTypeInfo);
}




/** @typedef {import ("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @param {RangeValues} values
 * @param {Number} columnIndex
 *
 * @returns {SheetsValuesColumnCluster[]}
 */
function getColumnTableTypeClusters_(values, columnIndex) {
    /**
     * @param {TypeCheckResult} typeInfo
     *
     * @returns {Boolean}
     */
    function _isNullRow(typeInfo) {
        if (typeInfo.type === "null")
            return true;
        if (typeInfo.string_like_type === "null")
            return true;
        return false;
    }
    var currentClusterKey = "", preClusterKey = "";
    /**
     * @param {TypeCheckResult} typeInfo
     * @param {Boolean} isNull
     * @returns {String}
     */
    function _getClusterKey_(typeInfo, isNull) {
        var key = typeInfo.type + "#" + typeInfo.string_like_type;
        if (currentClusterKey === "")
            return key;
        if (isNull)
            return currentClusterKey;
        return key;
    }
    /** @type {ColumnClusterType_} */
    var Cluster = null;
    var isNull = false;
    /** @type {SheetsValuesColumnCluster[]} */
    var result = [];
    var position = 0;
    /**
     * @param {ColumnClusterType_|null} cluster
     */
    function _addClusterToResult_(cluster) {
        if (!cluster)
            return;
        var validation = cluster.validate();
        if (!validation.is_valid)
            return;
        result.push(cluster.getInfo(position));
        position++;
    }
    for (var index = 0; index < values.length; index++) {
        var element = values[index][columnIndex];
        var typeInfo = getBasicType_(element);
        isNull = _isNullRow(typeInfo);
        currentClusterKey = _getClusterKey_(typeInfo, isNull);
        if (currentClusterKey !== preClusterKey) {
            _addClusterToResult_(Cluster);
            Cluster = new ColumnClusterType_(typeInfo, index, columnIndex);
        }
        else if (Cluster) {
            Cluster.addItem(typeInfo, isNull);
        }
        preClusterKey = currentClusterKey;
    }
    _addClusterToResult_(Cluster);
    return result;
}

/** @typedef {import ("./cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {RangeValues} values
 *
 * @returns {SheetsValuesColumnCluster[][]} clusters collections by data columns
 */
function getAllValuesClusters_(values) {
    var clustersMap = [];
    for (var i = 0; i < values[0].length; i++) {
        var clusters = getColumnTableTypeClusters_(values, i);
        clustersMap.push(clusters);
    }
    return clustersMap;
}

/**
 * @param {Number[][]} possibleFirstRowsMap
 * @param {Number} [headerRow]
 *
 * @returns {Number}
 */
function getValuesClustersFirstDataRow_(possibleFirstRowsMap, headerRow) {
    headerRow = headerRow || 0;
    if (!possibleFirstRowsMap.length)
        return 0;
    var commonRows = possibleFirstRowsMap.reduce(function (a, b) {
        return a.filter(function (c) { return b.includes(c); });
    });
    var commonRowsBelowHeader = commonRows.filter(function (r) { return r > headerRow; });
    return Math.min.apply(Math, commonRowsBelowHeader);
}

// @ts-nocheck


/**
 * @param {TypeCheckResult[]} types
 *
 * @returns {TypeCheckResult}
 */
function getMergeCommonDataTypesType_(types) {
    var maxScale = null;
    var maxPrecision = null;
    var maxSize = 0;
    /** @param {TypeCheckResult} t */
    function _updateMaxMeasures_(t) {
        if (t.precision) {
            maxPrecision = Math.max(t.precision, maxPrecision);
        }
        if (t.scale) {
            maxScale = maxScale || 0;
            maxScale = Math.max(t.scale, maxScale);
        }
        if (t.size) {
            maxSize = maxSize || 0;
            maxSize = Math.max(t.size, maxSize);
        }
    }
    /**
     * @param {TypeCheckResult} t
     * @returns {String}
     */
    function _typeKey_(t) {
        var type = t.type;
        /** @type {String} */
        var stringLikeType = t.string_like_type;
        if (!stringLikeType)
            stringLikeType = "_";
        return type + "#" + stringLikeType;
    }
    /**
     * @param {TypeCheckResult} t
     * @returns {BasicDataType}
     */
    function _stringLikeTypeKey_(t) {
        var type = t.type;
        if (t.string_like_type)
            type = t.string_like_type;
        return type;
    }
    var typesObj = {};
    var stringLikeTypes = {};
    types.forEach(function (type) {
        var key = _typeKey_(type);
        var stringKey = _stringLikeTypeKey_(type);
        typesObj[key] = type;
        stringLikeTypes[stringKey] = type;
        _updateMaxMeasures_(type);
    });
    /**
     * @param {BasicDataType} type
     * @param {BasicDataType} stringLikeType
     *
     * @returns {TypeCheckResult}
     */
    function _result_(type, stringLikeType) {
        /** @type TypeCheckResult */
        var result = {
            type: type,
            string_like_type: stringLikeType,
            size: maxSize,
        };
        if (maxPrecision) {
            result.precision = maxPrecision;
        }
        if (maxScale) {
            result.scale = maxScale;
        }
        return result;
    }
    // same type merging
    var keys = Object.keys(typesObj);
    if (keys.length === 1) {
        return _result_(types[0].type, types[0].string_like_type);
    }
    /** @type {*} */
    var stringLikeKeys = Object.keys(stringLikeTypes);
    // single string-like type
    if (stringLikeKeys.length === 1) {
        return _result_("string", stringLikeKeys[0]);
    }
    return {
        size: maxSize,
        type: "string",
        string_like_type: "string",
    };
}

// @ts-nocheck
/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {SheetsValuesColumnCluster[]} clusters
 *
 * @returns {SheetsValuesColumnCluster}
 */
function mergeColumnValuesClusters_(clusters) {
    var startingRow = null;
    var endingRow = null;
    var nullIndexes = [];
    /** @type {TypeCheckResult[]} */
    var types = [];
    clusters.sort(function (a, b) { return a.start_index - b.start_index; });
    /**
     * @param {Number} index
     * @returns {Number[]}
     */
    function _getGaps_(index) {
        if (index === 0)
            return [];
        var pre = clusters[index - 1];
        var cur = clusters[index];
        var sizeGap = cur.start_index - pre.end_index;
        if (sizeGap < 0) {
            throw new Error("Clusters in 1 column cannot intersect");
        }
        if (sizeGap === 1)
            return [];
        var res = [];
        for (var i = pre.end_index + 1; i < cur.start_index; i++) {
            res.push(i);
        }
        return res;
    }
    clusters.forEach(function (cl, i) {
        var rowStart = cl.start_index;
        var rowEnd = cl.end_index;
        if (!startingRow || startingRow > rowStart) {
            startingRow = rowStart;
        }
        if (!endingRow || endingRow < rowEnd) {
            endingRow = rowEnd;
        }
        var gaps = _getGaps_(i);
        nullIndexes = nullIndexes.concat(gaps).concat(cl.indexes_null);
        types.push({
            type: cl.type,
            string_like_type: cl.string_like_type,
            size: cl.max_size,
            precision: cl.max_precision,
            scale: cl.max_scale,
        });
    });
    var finalType = getMergeCommonDataTypesType_(types);
    var result = {
        start_index: startingRow,
        end_index: endingRow,
        string_like_type: finalType.string_like_type,
        type: finalType.type,
        max_size: finalType.size,
        max_precision: finalType.precision || 0,
        max_scale: finalType.scale || 0,
        column_index: clusters[0].column_index,
        indexes_null: nullIndexes,
    };
    return result;
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */

/**
 * @param {SheetsValuesColumnCluster[]} clusters
 * @param {Number} rowNum
 * @param {SheetsValuesColumnCluster[][]} allClusters
 *
 * @returns {SheetsValuesColumnCluster[]} last_row
 */
function getGridValuesClustersMerged_(clusters, rowNum, allClusters) {
    var result = [];
    /**
     * @param {SheetsValuesColumnCluster[]} clustersColumn
     * @param {Number} position
     *
     * @returns    {SheetsValuesColumnCluster|null}
     */
    function _getNextCluster_(clustersColumn, position) {
        var next = clustersColumn[position];
        if (!next)
            return null;
        if (next.start_index > rowNum)
            return null;
        return next;
    }
    /**
     * @param {SheetsValuesColumnCluster} cluster
     * @returns {SheetsValuesColumnCluster}
     */
    function _getMerged_(cluster) {
        if (cluster.end_index >= rowNum)
            return cluster;
        var clustersColumn = allClusters[cluster.column_index];
        var stop = false;
        var clusters = [cluster];
        var indexNext = cluster.position + 1; // next cluster
        var next = null;
        while (!stop) {
            next = _getNextCluster_(clustersColumn, indexNext);
            if (next) {
                clusters.push(next);
            }
            else {
                stop = true;
            }
            indexNext++;
        }
        if (clusters.length === 1)
            return cluster;
        return mergeColumnValuesClusters_(clusters);
    }
    clusters.forEach(function (cls) {
        var merged = _getMerged_(cls);
        result.push(merged);
    });
    return result;
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @param {SheetsValuesColumnCluster[]} clusters
 *
 * @returns {SheetsValuesColumnCluster[]}
 */
function getNonStringColumnValuesClusters_(clusters) {
    var res = clusters.filter(function (cl) {
        /** @type {String} */
        var stringLikeType = cl.string_like_type || "";
        if (stringLikeType === "string")
            return false;
        return true;
    });
    return res;
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @param {SheetsValuesColumnCluster} cluster
 * @param {Number} rowTo
 *
 * @returns {SheetsValuesColumnCluster}
 */
function cropColumnValuesCluster_(cluster, rowTo) {
    if (cluster.end_index <= rowTo)
        return cluster;
    /** @type {SheetsValuesColumnCluster} */
    var newCluster = JSON.parse(JSON.stringify(cluster));
    newCluster.indexes_null = newCluster.indexes_null.filter(function (i) { return i <= rowTo; });
    newCluster.end_index = rowTo;
    return newCluster;
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */


/**
 * @typedef {Object} ColumnValueClustersCropResponse
 * @prop {Boolean} can_crop
 * @prop {SheetsValuesColumnCluster[]} croppeed
 * @prop {String} [message]
 */
/**
 * @param {SheetsValuesColumnCluster} minCluster
 * @param {SheetsValuesColumnCluster[]} clusters
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {ColumnValueClustersCropResponse}
 */
function tryToCropColumnValuesClusters_(minCluster, clusters, info) {
    /**
     * @param {String} message
     * @returns {ColumnValueClustersCropResponse}
     */
    function _no_(message) {
        return {
            can_crop: false,
            message: message,
            croppeed: clusters,
        };
    }
    if (!minCluster) {
        return _no_("No min. cluster");
    }
    var rowTo = minCluster.end_index;
    var options = info.options;
    var clusterMinGroup = info.clusters[minCluster.column_index];
    var nextClusterAfterMin = clusterMinGroup.find(function (cl) { return cl.position > minCluster.position; });
    if (!nextClusterAfterMin)
        return _no_("No clusters after the given");
    var lastRows = clusters.map(function (c) { return c.end_index; });
    var maxRow = Math.max.apply(Math, lastRows);
    if (nextClusterAfterMin.start_index > maxRow) {
        return _no_("Next claster is far away...");
    }
    /**
     * @param {SheetsValuesColumnCluster} c
     * @returns {Boolean}
     */
    function cannotCrop_(c) {
        // +1 stands for the possible 1-row total in the end
        if (c.end_index <= rowTo + 1)
            return false;
        if (c.indexes_null.indexOf(rowAfterCrop) > -1)
            return false;
        return true;
    }
    var rowAfterCrop = rowTo + 1;
    var nonBlanksAfterBlank = [];
    for (var i = 0; i < clusters.length; i++) {
        var cl = clusters[i];
        if (cannotCrop_(cl))
            return _no_("k=" + i);
        if (cl.end_index < rowAfterCrop) {
            nonBlanksAfterBlank.push(0);
        }
        else {
            var blanksAfter = cl.indexes_null.filter(function (n) { return n > rowTo; });
            var numBlanks = blanksAfter.length;
            var numTotal = cl.end_index - rowTo;
            var numNonBlanks = numTotal - numBlanks;
            if (numNonBlanks < 0) {
                throw new Error("Logical error in script. Cannot have less <0 values");
            }
            nonBlanksAfterBlank.push(numNonBlanks);
        }
    }
    var sumNonBlanks = nonBlanksAfterBlank.reduce(function (p, c) { return p + c; }, 0);
    var averageNonBlank = Math.round(sumNonBlanks / nonBlanksAfterBlank.length);
    if (averageNonBlank > options.max_values_crop)
        return _no_("Not enough 'totals'");
    var newClusters = clusters.map(function (cls) {
        return cropColumnValuesCluster_(cls, rowTo);
    });
    return {
        can_crop: true,
        croppeed: newClusters,
    };
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @typedef {Object} LastValuesClusterRowResponse
 * @prop {SheetsValuesColumnCluster[]} matching_clusters - some clusters are merged or cropeed
 * @prop {Number} last_row
 */
/**
 * If all cluster columns are strings
 * @param {SheetsValuesColumnCluster[]} fitClusters
 * @param {SheetsValuesColumnCluster[][]} clustersMap
 *
 * @returns {LastValuesClusterRowResponse} last_row
 */
function getStringsValuesClustersLastDataRow_(fitClusters, clustersMap) {
    var mergedClusters = [];
    fitClusters.forEach(function (cl) {
        var columnIndex = cl.column_index;
        var position = cl.position;
        var otherClusters = clustersMap[columnIndex].filter(function (cl) {
            return cl.position >= position;
        });
        if (otherClusters.length === 0) {
            throw new Error("Programm logic error. No clusters found for set indexes");
        }
        var merged = mergeColumnValuesClusters_(otherClusters);
        mergedClusters.push(merged);
    });
    var maxEnd = mergedClusters.reduce(function (p, c) {
        return Math.max(c.end_index, p);
    }, 0);
    return {
        matching_clusters: mergedClusters,
        last_row: maxEnd,
    };
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */


/**
 * @param {SheetsValuesColumnCluster[]} fitClusters
 * @param {FitColumnValuesClustersInfo} info
 *
 * @returns {LastValuesClusterRowResponse} last_row
 */
function getValuesClustersLastDataRow_(fitClusters, info) {
    var nonStringClusters = getNonStringColumnValuesClusters_(fitClusters);
    if (nonStringClusters.length === 0) {
        return getStringsValuesClustersLastDataRow_(fitClusters, info.clusters);
    }
    /**
     * @param {SheetsValuesColumnCluster[]} clusterGroup
     * @param {Number} greaterThan
     *
     * @returns {SheetsValuesColumnCluster}
     */
    function _minGreaterRowCluster_(clusterGroup, greaterThan) {
        var minGreaterThanRow = clusterGroup.reduce(function (p, c) {
            return c.end_index > greaterThan &&
                (p === null || c.end_index < p.end_index)
                ? c
                : p;
        }, null);
        return minGreaterThanRow;
    }
    var canCrop = false;
    var cropResults = null;
    /** @type {Number} */
    var rowEnd = 0;
    var minRowCluster = null;
    var nextClusters = fitClusters;
    var forseEnd = false;
    while (!canCrop && !forseEnd) {
        minRowCluster = _minGreaterRowCluster_(nextClusters, rowEnd);
        if (minRowCluster) {
            rowEnd = minRowCluster.end_index;
            // can merge clusters?
            nextClusters = getGridValuesClustersMerged_(nextClusters, rowEnd, info.clusters);
        }
        else {
            forseEnd = true;
        }
        cropResults = tryToCropColumnValuesClusters_(minRowCluster, nextClusters, info);
        canCrop = cropResults.can_crop;
    }
    return {
        last_row: rowEnd,
        matching_clusters: cropResults.croppeed,
    };
}

/**
 * @param {Number[][]} missingColumnsMap
 * @returns {Number[]} common
 */
function getCommonColumnValuesClustersMissingColumns_(missingColumnsMap) {
    if (missingColumnsMap.length === 0)
        return [];
    var common = missingColumnsMap[0];
    var _loop_1 = function (i) {
        common = common.filter(function (value) { return missingColumnsMap[i].includes(value); });
    };
    for (var i = 1; i < missingColumnsMap.length; i++) {
        _loop_1(i);
    }
    return common;
}

/**
 * @param {Number[]} columns
 * @returns {Number[]}
 */
function getDataValuesClustersMissingColumns_(columns) {
    if (columns.length === 0) {
        return [];
    }
    var min = columns[0];
    var max = columns[0];
    // Single loop to find min and max
    for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
        var num = columns_1[_i];
        if (num < min)
            min = num;
        if (num > max)
            max = num;
    }
    // Create a boolean array to mark the existence of numbers in the range [min, max]
    var rangeLength = max - min + 1;
    var isPresent = new Array(rangeLength).fill(false);
    // Marking the presence of each number from the columns array
    for (var _a = 0, columns_2 = columns; _a < columns_2.length; _a++) {
        var num = columns_2[_a];
        isPresent[num - min] = true;
    }
    var missingIndexes = [];
    // Finding the missing indexes
    for (var i = 0; i < rangeLength; i++) {
        if (!isPresent[i]) {
            missingIndexes.push(i + min);
        }
    }
    return missingIndexes;
}

/**
 * @typedef {Object} RichColumnValuesHeader
 * @prop {String} original_value
 * @prop {String} database_value
 * @prop {Number} row_index
 * @prop {Number} column_index
 * @prop {Boolean} is_generic
 */
/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/**
 * @param {SheetColumnNamedClusterHeader[]} iniHeaders
 * @param {Number} [charsLimit]
 *
 * @returns {RichColumnValuesHeader[]}
 */
function getRichColumnValuesClustersHeaders_(iniHeaders, charsLimit) {
    if (charsLimit === void 0) { charsLimit = 500; }
    /** @type {RichColumnValuesHeader[]} */
    var result = [];
    var nextIndex = 0;
    /**
     * @returns {String}
     */
    function _genericHeader_() {
        nextIndex++;
        return "Col" + nextIndex;
    }
    var prefix = "_";
    var previousValues = [];
    iniHeaders.forEach(function (h) {
        var header;
        var isGeneric = false;
        if (h.header_response.is_valid) {
            header = h.header_response.suggested_value.toLowerCase();
        }
        else {
            header = _genericHeader_();
            isGeneric = true;
        }
        var serialHeader = getSerialName_(header, {
            chars_limit: charsLimit,
            other_names: previousValues,
            prefix: prefix,
        });
        if (!serialHeader.is_valid) {
            header = _genericHeader_();
            isGeneric = true;
            header = getSerialName_(header, {
                prefix: prefix,
                other_names: previousValues,
            }).name;
        }
        else {
            header = serialHeader.name;
        }
        result.push({
            column_index: h.column_index,
            database_value: header,
            original_value: h.header_response.original_value,
            row_index: h.row_index,
            is_generic: isGeneric,
        });
        previousValues.push(header);
    });
    return result;
}



/** @typedef {import("../getclusterheaders").SheetColumnNamedClusterHeader} SheetColumnNamedClusterHeader*/
/**
 * DEDUPE
 *   1. More none-dupe matches
 *   2. Top clusters
 *
 * @param {SchemaValuesCluster[]} bestFullInfo
 *
 * @returns {SchemaValuesCluster[]}
 */
function getDedupedColumnsValuesClusterFullInfo_(bestFullInfo) {
    if (!bestFullInfo)
        return [];
    if (!bestFullInfo.length)
        return [];
    if (!bestFullInfo[0].cluster)
        return [];
    if (!bestFullInfo[0].header)
        return [];
    if (!bestFullInfo[0].possible_rows_start)
        return [];
    var clusters = bestFullInfo.map(function (nf) { return nf.cluster; });
    var headers = bestFullInfo.map(function (nf) { return nf.header; });
    var rowHeader = headers[0].row_index;
    var possibleRowsStart = bestFullInfo.map(function (nf) {
        return nf.possible_rows_start.filter(function (r) { return r > rowHeader; });
    });
    /**
     *
     * @param {SheetsValuesColumnCluster[]} clstrs
     * @param {SheetColumnNamedClusterHeader[]} hdrs
     * @param {Number[][]} rws
     *
     * @returns {SchemaValuesCluster[]}
     */
    function _res_(clstrs, hdrs, rws) {
        /** @type {SchemaValuesCluster[]} */
        var res = [];
        clstrs.forEach(function (c, i) {
            res.push({
                cluster: c,
                header: hdrs[i],
                possible_rows_start: rws[i],
            });
        });
        return res;
    }
    /**
     * @typedef {Object} SingleColumnValuesClusterDupeInfo
     * @prop {Number} column_index
     * @prop {SheetsValuesColumnCluster[]} clusters
     * @prop {Number[][]} rows_start
     * @prop {SheetColumnNamedClusterHeader[]} headers
     */
    var dupesCount = 0;
    /** @type {SingleColumnValuesClusterDupeInfo[]} */
    var allGroups = [];
    /** @type {SheetsValuesColumnCluster[]} */
    var nondupes = [];
    /** @type {Number[][]} */
    var nonDupeRowsStart = [];
    var dupesCheck = {};
    /**
     * @param {SingleColumnValuesClusterDupeInfo[]} grp
     * @param {SheetsValuesColumnCluster} c
     * @param {Number} index
     */
    function _addToGroup_(grp, c, index) {
        var rw = possibleRowsStart[index];
        var hh = headers[index];
        var dp = grp.find(function (d) { return d.column_index == c.column_index; });
        if (dp) {
            dp.clusters.push(c);
            dp.rows_start.push(rw);
            dp.headers.push(hh);
            return;
        }
        grp.push({
            clusters: [c],
            column_index: c.column_index,
            rows_start: [rw],
            headers: [hh],
        });
    }
    clusters.forEach(function (c, i) {
        _addToGroup_(allGroups, c, i);
        var key = "" + c.column_index;
        if (dupesCheck[key]) {
            dupesCount++;
            return;
        }
        nondupes.push(c);
        nonDupeRowsStart.push(possibleRowsStart[i]);
        dupesCheck[key] = true;
    });
    if (dupesCount === 0) {
        return _res_(clusters, headers, possibleRowsStart);
    }
    /**
     * @param {SheetsValuesColumnCluster} c1
     * @param {SheetsValuesColumnCluster} c2
     *
     * @param {Number[]} rw1
     * @param {Number[]} rw2
     *
     * @returns {Boolean}
     */
    function _2ClustersMatch_(c1, c2, rw1, rw2) {
        if (c1.column_index === c2.column_index)
            return false;
        var commonRowStart = rw1.findIndex(function (r) { return rw2.includes(r); });
        if (commonRowStart === -1)
            return false;
        return true;
    }
    /**
     * @typedef {Object} DedupedColumnValuasCluatersResponse
     * @prop {SheetsValuesColumnCluster} cluster
     * @prop {Number[]} headers
     * @prop {SheetColumnNamedClusterHeader} headerObj
     */
    /**
     * @param {SingleColumnValuesClusterDupeInfo} grp
     *
     * @returns {DedupedColumnValuasCluatersResponse}
     */
    function _add_(grp) {
        if (grp.clusters.length === 1) {
            return {
                cluster: grp.clusters[0],
                headers: grp.rows_start[0],
                headerObj: grp.headers[0],
            };
        }
        var numMatchesForClusters = [];
        var minRowStart = undefined;
        var maxMatches = 0;
        grp.clusters.forEach(function (c1, i1) {
            var rw1 = grp.rows_start[i1];
            var numMatches = 0;
            nondupes.forEach(function (c2, i2) {
                var rw2 = nonDupeRowsStart[i2];
                var matches = _2ClustersMatch_(c1, c2, rw1, rw2);
                if (matches)
                    numMatches++;
            });
            numMatchesForClusters.push(numMatches);
            if (numMatches > maxMatches) {
                maxMatches = numMatches;
            }
            if (minRowStart === undefined) {
                minRowStart = c1.start_index;
            }
            else if (minRowStart > c1.start_index) {
                minRowStart = c1.start_index;
            }
        });
        var indexesFound = [];
        var clustersWithMaxMathces = grp.clusters.filter(function (c, i) {
            var matches = numMatchesForClusters[i];
            var match = matches === maxMatches;
            if (match) {
                indexesFound.push(i);
                return true;
            }
            return false;
        });
        if (clustersWithMaxMathces.length === 1) {
            return {
                cluster: clustersWithMaxMathces[0],
                headers: grp.rows_start[indexesFound[0]],
                headerObj: grp.headers[indexesFound[0]],
            };
        }
        indexesFound = [];
        var topClusters = grp.clusters.filter(function (c, i) {
            var match = minRowStart === c.start_index;
            if (match) {
                indexesFound.push(i);
                return true;
            }
            return false;
        });
        return {
            cluster: topClusters[0],
            headers: grp.rows_start[indexesFound[0]],
            headerObj: grp.headers[indexesFound[0]],
        };
    }
    /** @type {SheetsValuesColumnCluster[]} */
    var dedupedClusters = [];
    /** @type {Number[][]} */
    var numFinalRowsStart = [];
    /** @type {SheetColumnNamedClusterHeader[]} */
    var finalHeaders = [];
    allGroups.forEach(function (grp) {
        var clsGrp = _add_(grp);
        dedupedClusters.push(clsGrp.cluster);
        numFinalRowsStart.push(clsGrp.headers);
        finalHeaders.push(clsGrp.headerObj);
    });
    return _res_(dedupedClusters, finalHeaders, numFinalRowsStart);
}

/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */


/**
 * @typedef {Object} BestFitClustersInfo
 * @prop {SheetsValuesColumnCluster[]} clusters
 * @prop {Number} row_data_starts
 * @prop {Number} row_data_ends
 * @prop {Number[]} missing_rows
 * @prop {Number[]} missing_columns
 * @prop {RichColumnValuesHeader[]} headers
 */
/**
 * @param {RangeValues} values
 *
 * @returns {BestFitClustersInfo}
 */
function getAllFitClustersInfo_(values) {
    var clustersMap = getAllValuesClusters_(values);
    var bestFit1 = findNextBestFitValuesCluster_(clustersMap, null);
    var bestCluster1 = bestFit1.best_cluster;
    var info = getInitialFitColumnValuesClustersInfo_(bestCluster1, values, clustersMap);
    var fitting = getColumnValueClustersRowFit_(info);
    var reduced = reduceFittingClustersByMaxColumnGap_(fitting, bestCluster1, info.options.max_skipped_columns);
    var withHeaders = getAllMatchedColumnValueClutersHeaders_(reduced, info);
    if (!withHeaders)
        return null;
    var islands = getColumnValueClusterHeaderIslands_(withHeaders.valid_headers_map, withHeaders.possible_rows_map);
    var biggestIslands = getBiggerClusterHeadersByIslands_(islands);
    var fullInfo = getFullValuesClusterHeaderInfoMap_(biggestIslands, withHeaders);
    var bestFullInfoDuped = getBestValueClustersFullInfoForSchema_(fullInfo);
    if (bestFullInfoDuped.length === 0) {
        return null;
    }
    var bestFullInfo = getDedupedColumnsValuesClusterFullInfo_(bestFullInfoDuped);
    var firstRow = getValuesClustersFirstDataRow_(bestFullInfo.map(function (el) { return el.possible_rows_start; }), bestFullInfo[0].header.row_index);
    var bestClusters = bestFullInfo.map(function (el) { return el.cluster; });
    var lastRowResponse = getValuesClustersLastDataRow_(bestClusters, info);
    var missingRows = getCommonColumnValuesClustersMissingColumns_(lastRowResponse.matching_clusters.map(function (e) { return e.indexes_null; }));
    var missingColumns = getDataValuesClustersMissingColumns_(lastRowResponse.matching_clusters.map(function (c) { return c.column_index; }));
    var iniHeaders = bestFullInfo.map(function (e) { return e.header; });
    var richHeaders = getRichColumnValuesClustersHeaders_(iniHeaders, info.options.max_header_lenght);
    return {
        clusters: lastRowResponse.matching_clusters,
        row_data_starts: firstRow,
        row_data_ends: lastRowResponse.last_row,
        missing_rows: missingRows,
        missing_columns: missingColumns,
        headers: richHeaders,
    };
}



/**
 * @param {RichColumnValuesHeader[]} headers
 *
 * @returns {RangeGrid[]}
 */
function getValuesheaderHeadersRangeGrids_(headers) {
    if (!headers)
        return [];
    if (!headers.length)
        return [];
    headers.sort(function (a, b) {
        return a.column_index - b.column_index;
    });
    var rowStart = headers[0].row_index;
    var rowEnd = rowStart;
    /**
     * @param {RichColumnValuesHeader} header
     * @returns {RangeGrid}
     */
    function _get_(header) {
        return {
            startRowIndex: rowStart,
            startColumnIndex: header.column_index,
            endRowIndex: rowEnd + 1,
            endColumnIndex: header.column_index + 1,
        };
    }
    /** @type {RangeGrid[]} */
    var grids = [];
    var fromIndex = 0;
    /**
     * @param {RangeGrid} grid
     */
    function _populate_(grid) {
        grids.push(grid);
    }
    /**
     * @param {RichColumnValuesHeader} header
     * @param {Number} index
     */
    function _add_(header, index) {
        var isLast = index === headers.length - 1;
        if (isLast && index === 0) {
            _populate_(_get_(header));
            return;
        }
        if (index === 0)
            return;
        var grid0 = null;
        if (header.column_index - headers[index - 1].column_index > 1) {
            grid0 = _get_(headers[fromIndex]);
            grid0.endColumnIndex += index - fromIndex - 1;
            _populate_(grid0);
            fromIndex = index;
        }
        if (isLast) {
            if (grid0) {
                // already have break
                _populate_(_get_(header));
                return;
            }
            grid0 = _get_(headers[fromIndex]);
            grid0.endColumnIndex += index - fromIndex;
            _populate_(grid0);
        }
    }
    headers.forEach(_add_);
    return grids;
}


/** @typedef {import ("@/tablers/columntypecluster/cluster").SheetsValuesColumnCluster} SheetsValuesColumnCluster */
/**
 * @param {SheetsValuesColumnCluster[]} clusters
 * @param {Number} rowStart
 * @param {Number} rowEnd
 * @param {Number[]} [missingRows]
 *
 * @returns {RangeGrid[]}
 */
function getValuesClustersRangeGrids_(clusters, rowStart, rowEnd, missingRows) {
    clusters.sort(function (a, b) {
        return a.column_index - b.column_index;
    });
    /**
     * @param {Number} startRow
     * @param {Number} endRow
     * @parm {Number[]} [skipRows]
     *
     * @returns {Number[][]}
     */
    function _getStartEndPairs_(startRow, endRow, skipRows) {
        if (!skipRows) {
            return [[startRow, endRow]];
        }
        // Sort the skipRows array to ensure it is in ascending order
        skipRows.sort(function (a, b) { return a - b; });
        var pairs = [];
        var currentStart = startRow;
        for (var i = startRow; i <= endRow; i++) {
            // If the current row should be skipped
            if (skipRows.includes(i)) {
                if (i - 1 >= currentStart) {
                    pairs.push([currentStart, i - 1]);
                }
                currentStart = i + 1;
            }
        }
        // Add the last segment if there's any remaining
        if (currentStart <= endRow) {
            pairs.push([currentStart, endRow]);
        }
        return pairs;
    }
    var rowIslands = _getStartEndPairs_(rowStart, rowEnd, missingRows);
    /**
     * @param {SheetsValuesColumnCluster} cluster
     * @returns {RangeGrid}
     */
    function _get_(cluster) {
        return {
            startRowIndex: rowStart,
            startColumnIndex: cluster.column_index,
            endRowIndex: rowEnd + 1,
            endColumnIndex: cluster.column_index + 1,
        };
    }
    /** @type {RangeGrid[]} */
    var grids = [];
    var fromIndex = 0;
    /**
     * @param {RangeGrid} grid
     */
    function _populate_(grid) {
        rowIslands.forEach(function (i) {
            /** @type {RangeGrid} */
            var g = {
                startColumnIndex: grid.startColumnIndex,
                endColumnIndex: grid.endColumnIndex,
                startRowIndex: i[0],
                endRowIndex: i[1] + 1,
            };
            grids.push(g);
        });
    }
    /**
     * @param {SheetsValuesColumnCluster} cluster
     * @param {Number} index
     */
    function _add_(cluster, index) {
        var isLast = index === clusters.length - 1;
        if (isLast && index === 0) {
            _populate_(_get_(cluster));
            return;
        }
        if (index === 0)
            return;
        var grid0 = null;
        if (cluster.column_index - clusters[index - 1].column_index > 1) {
            grid0 = _get_(clusters[fromIndex]);
            grid0.endColumnIndex += index - fromIndex - 1;
            _populate_(grid0);
            fromIndex = index;
        }
        if (isLast) {
            if (grid0) {
                // already have break
                _populate_(_get_(cluster));
                return;
            }
            grid0 = _get_(clusters[fromIndex]);
            grid0.endColumnIndex += index - fromIndex;
            _populate_(grid0);
        }
    }
    clusters.forEach(_add_);
    return grids;
}

// @ts-nocheck

/**
 * @param {RangeGrid} grid
 * @returns {String}
 */
function getRangeGridByRangeA1_(grid) {
    if (!grid) {
        throw new Error("Grid is required parameter for getting A1-Range");
    }
    var startRowIndex = grid.startRowIndex, endRowIndex = grid.endRowIndex, startColumnIndex = grid.startColumnIndex, endColumnIndex = grid.endColumnIndex;
    /**
     * @param {*} val
     */
    function isUndefined_(val) {
        return typeof val === "undefined";
    }
    if (isUndefined_(endRowIndex)) {
        endRowIndex = startRowIndex + 1;
    }
    if (isUndefined_(endColumnIndex)) {
        endColumnIndex = startColumnIndex + 1;
    }
    /**
     * @typedef {Object} GridEnd
     * @prop {Number} row
     * @prop {String} col
     */
    /** @type {GridEnd} */
    var start = {};
    /** @type {GridEnd} */
    var end = {};
    if (!isUndefined_(startColumnIndex)) {
        start.col = columnIndexToLetters_(startColumnIndex);
    }
    else if (isUndefined_(startColumnIndex) && !isUndefined_(endColumnIndex)) {
        start.col = "A";
    }
    if (!isUndefined_(startRowIndex)) {
        start.row = startRowIndex + 1;
    }
    else if (isUndefined_(startRowIndex) && !isUndefined_(endRowIndex)) {
        start.row = endRowIndex;
    }
    end.col = columnIndexToLetters_(endColumnIndex - 1);
    end.row = endRowIndex;
    var k = ["col", "row"];
    var st = k.map(function (e) { return start[e]; }).join("");
    var en = k.map(function (e) { return end[e]; }).join("");
    var a1Notation = st == en ? st : "".concat(st, ":").concat(en);
    return a1Notation;
}



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
function getTheFirstSheetSchema_(values, rowIndex, colIndex) {
    if (!values)
        return null;
    if (!values.length)
        return null;
    if (!values[0].length)
        return null;
    if (values.length < 2)
        return null;
    var fitResults = getAllFitClustersInfo_(values);
    if (!fitResults)
        return null;
    if (!fitResults.headers.length)
        return null;
    var headerGrids = getValuesheaderHeadersRangeGrids_(fitResults.headers);
    var dataGrids = getValuesClustersRangeGrids_(fitResults.clusters, fitResults.row_data_starts, fitResults.row_data_ends, fitResults.missing_rows);
    /** @type {SheetRangeGroupCoordinates} */
    var headerCoordinates = {
        grids: headerGrids,
        ranges_a1: headerGrids.map(getRangeGridByRangeA1_),
    };
    /** @type {SheetRangeGroupCoordinates} */
    var dataCoordinates = {
        grids: dataGrids,
        ranges_a1: dataGrids.map(getRangeGridByRangeA1_),
    };
    /** @type {SheetFieldSchema[]} */
    var fields = [];
    fitResults.clusters.sort(function (a, b) {
        return a.column_index - b.column_index;
    });
    fitResults.headers.sort(function (a, b) {
        return a.column_index - b.column_index;
    });
    fitResults.clusters.forEach(function (c, i) {
        var h = fitResults.headers[i];
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
        fields: fields,
        row_data_starts: fitResults.row_data_starts,
        row_data_ends: fitResults.row_data_ends,
        row_headers: fitResults.headers[0].row_index,
        skipped_column_indexes: fitResults.missing_columns,
        skipped_row_indexes: fitResults.missing_rows,
    };
}


/**
 * @param {Array[][]} values
 * @param {SheetFieldSchema[]} fields
 * @param {Number} rowDataStarts
 * @param {Number} rowDataEnds
 * @param {Number[]} skippingRowIndexes
 *
 */
function getTablerDataByCoorfinates_(values, fields, rowDataStarts, rowDataEnds, skippingRowIndexes) {
    var header = [];
    fields.forEach(function (field) {
        header.push(field.database_value);
    });
    var resultingData = [header];
    /**
     * @param {Number} rowIndex
     */
    function _addToData(rowIndex) {
        if (skippingRowIndexes.indexOf(rowIndex) > -1)
            return;
        var newRow = [];
        fields.forEach(function (field) {
            var columnIndex = field.column_index;
            newRow.push(values[rowIndex][columnIndex]);
        });
        resultingData.push(newRow);
    }
    for (var i = rowDataStarts; i <= rowDataEnds; i++) {
        _addToData(i);
    }
    return resultingData;
}




/**
 * @constructor
 * @param {RangeValues|*} values
 */
function TablerStore_(values) {
    var self = this;
    self.values = values;
    /** @type {ValuesCheckResponse|null} */
    self.validation = null;
    /** @type {SheetTableSchema|null} */
    self.schema = null;
    /**
     * @method
     * @returns {ValuesCheckResponse}
     */
    self.validate = function () {
        if (self.validation)
            return self.validation;
        self.validation = checkValuesIsvalidRectangle_(self.values);
        return self.validation;
    };
    /**
     * @method
     * @returns {SheetTableSchema|null}
     */
    self.getSchema = function () {
        if (self.schema)
            return self.schema;
        var validation = self.validate();
        if (!validation.is_valid) {
            return null;
        }
        var schema = getTheFirstSheetSchema_(self.values);
        self.schema = schema;
        return schema;
    };
    /**
     * @method
     * @param {SheetTableSchema|null} schema
     */
    self.setSchema = function (schema) {
        self.schema = schema;
    };
    /**
     * @method
     *
     * @returns  {Array[][]}
     */
    self.getData = function () {
        if (!self.schema)
            self.getSchema();
        return getTablerDataByCoorfinates_(self.values, self.schema.fields, self.schema.row_data_starts, self.schema.row_data_ends, self.schema.skipped_row_indexes);
    };
}

/**
 * @typedef {Array<Array>} RangeValues
 */

/**
 * @constructor
 * @param {RangeValues} values
 */
function Tabler_(values) {
    var store = new TablerStore_(values);
    var self = this;
    /**
     * @method
     * @returns {SheetTableSchema}
     */
    self.getSchema = function () {
        return store.getSchema();
    };
    /**
     * @method
     * @param {SheetTableSchema} schema
     */
    self.setSchema = function (schema) {
        store.setSchema(schema);
    };
    /**
     * @method
     * @param {SheetTableSchema} [schema]
     */
    self.getData = function (schema) {
        if (schema)
            self.setSchema(schema);
        return store.getData();
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
    var t = new Tabler_([["boo"]]);
    console.log(t.getSchema());
}
// Polifils
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError("Array.prototype.findIndex called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
            return false;
        }
        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (o[k] === searchElement) {
                return true;
            }
            k++;
        }
        return false;
    };
}
if (!Array.prototype.fill) {
    Array.prototype.fill = function (value) {
        // Steps 1-2.
        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        var start = arguments[1];
        var relativeStart = start >> 0;
        var k = relativeStart < 0
            ? Math.max(len + relativeStart, 0)
            : Math.min(relativeStart, len);
        var end = arguments[2];
        var relativeEnd = end === undefined ? len : end >> 0;
        var final = relativeEnd < 0
            ? Math.max(len + relativeEnd, 0)
            : Math.min(relativeEnd, len);
        while (k < final) {
            O[k] = value;
            k++;
        }
        return O;
    };
}
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== "function") {
                throw new TypeError("predicate must be a function");
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }
            return undefined;
        },
    });
}
