import { getDummySum_ } from "./sample";

export function test_code() {
  console.log(getDummySum_(1, 2));
}

//
//
//
//
//
//
// _____      _        __ _ _ _
// |  __ \    | |      / _(_) | |
// | |__) |__ | |_   _| |_ _| | |___
// |  ___/ _ \| | | | |  _| | | / __|
// | |  | (_) | | |_| | | | | | \__ \
// |_|   \___/|_|\__, |_| |_|_|_|___/
//                __/ |
//               |___/
//
//
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    if (this === null) {
      throw new TypeError(
        "Array.prototype.findIndex called on null or undefined"
      );
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
    var k =
      relativeStart < 0
        ? Math.max(len + relativeStart, 0)
        : Math.min(relativeStart, len);
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0;
    var final =
      relativeEnd < 0
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
