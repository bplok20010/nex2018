define(["exports"], function (exports) {
    'use strict';

    exports.__esModule = true;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    exports.isString = isString;
    exports.isNumber = isNumber;
    exports.isNull = isNull;
    exports.isTrue = isTrue;
    exports.isUndefined = isUndefined;
    exports.isDefined = isDefined;
    exports.isStringOrNumber = isStringOrNumber;
    exports.isNullOrUndef = isNullOrUndef;
    exports.isInvalid = isInvalid;
    exports.isEmpty = isEmpty;
    exports.isPromiseLike = isPromiseLike;
    exports.isWindow = isWindow;
    exports.isEmptyObject = isEmptyObject;
    exports.throwError = throwError;
    exports.warning = warning;
    exports.isArrayLike = isArrayLike;
    exports.identity = identity;
    exports.has = has;
    exports.keys = keys;
    exports.extend = extend;
    exports.extendIf = extendIf;
    exports.values = values;
    exports.noop = noop;
    exports.toArray = toArray;
    exports.each = each;
    exports.map = map;
    exports.filter = filter;
    exports.compact = compact;
    exports.indexOf = indexOf;
    exports.contains = contains;
    exports.uniq = uniq;
    exports.range = range;
    exports.bind = bind;
    exports.delay = delay;
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    function _extend(dest, source) {
        var i, j, k;

        for (i in source) {
            dest[i] = source[i];
        }

        return dest;
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isNumber(obj) {
        return typeof obj === 'number';
    }

    var isArray = exports.isArray = nativeIsArray ? nativeIsArray : function (value) {
        return toString.call(value) === '[object Array]';
    };

    function isNull(obj) {
        return obj === null;
    }

    function isTrue(obj) {
        return obj === true;
    }

    function isUndefined(obj) {
        return obj === undefined;
    }

    function isDefined(obj) {
        return obj !== undefined;
    }

    function isStringOrNumber(obj) {
        return isString(obj) || isNumber(obj);
    }

    function isNullOrUndef(obj) {
        return isUndefined(obj) || isNull(obj);
    }

    function isInvalid(obj) {
        return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
    }

    function isEmpty(value, allowEmptyString) {
        return value === null || value === undefined || (!allowEmptyString ? value === '' : false) || isArray(value) && value.length === 0 || isObject(value) && isEmptyObject(value);
        //return (!allowEmptyString ? value === '' : false) || isEmpty(value);
    }

    function isPromiseLike(promise) {
        return promise && isFunction(promise.then);
    }

    function isWindow(obj) {
        return obj != null && obj == obj.window;
    }

    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    function throwError(message) {
        if (!message) {
            message = 'a runtime error occured!';
        }
        throw new Error('Neact Error: ' + message);
    }

    function warning(message) {
        console && console.warn(message);
    }

    function isArrayLike(obj) {
        var length = obj == null ? void 0 : obj.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    var isObject = exports.isObject = toString.call(null) === '[object Object]' ? function (value) {
        // check ownerDocument here as well to exclude DOM nodes
        return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
    } : function (value) {
        return toString.call(value) === '[object Object]';
    };

    var now = exports.now = Date.now || function () {
        return new Date().getTime();
    };

    function identity(value) {
        return value;
    }

    function has(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    }

    function keys(obj) {
        if (!isObject(obj)) return [];

        if (nativeKeys) return nativeKeys(obj);

        var keys = [];

        for (var key in obj) {
            if (has(obj, key)) keys.push(key);
        }return keys;
    }

    function extend(dest, sources) {
        if (!dest) {
            dest = {};
        }
        for (var i = 1, l = arguments.length; i < l; i++) {
            _extend(dest, arguments[i]);
        }
        return dest;
    }

    function extendIf(dest, sources) {
        var i = 1,
            l = arguments.length,
            prop;

        if (!dest) {
            dest = {};
        }

        for (; i < l; i++) {
            for (prop in arguments[i]) {
                if (dest[prop] === undefined) {
                    dest[prop] = arguments[i][prop];
                }
            }
        }

        return dest;
    }

    function values(obj) {
        var keys = keys(obj);
        var length = keys.length;
        var values = Array(length);

        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }

        return values;
    }

    function noop() {}

    function toArray(obj) {
        if (!obj) return [];
        if (isArray(obj)) return slice.call(obj);
        if (isArrayLike(obj)) return map(obj, identity);

        return values(obj);
    }

    function each(obj, iterator, context) {
        if (obj == null) return obj;

        var i,
            length,
            hasContext = context === void 0 ? false : true;

        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(hasContext ? context : obj[i], obj[i], i, obj) === false) break;
            }
        } else {
            var _keys = keys(obj);

            for (i = 0, length = _keys.length; i < length; i++) {
                if (iterator.call(hasContext ? context : obj[_keys[i]], obj[_keys[i]], _keys[i], obj) === false) break;
            }
        }

        return obj;
    }

    var forEach = exports.forEach = each;

    function map(obj, iterator, context) {
        if (obj == null) return obj;

        var i,
            length,
            results = [],
            hasContext = context === void 0 ? false : true;

        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                results.push(iterator.call(hasContext ? context : obj[i], obj[i], i, obj));
            }
        } else {
            var keys = keys(obj);

            for (i = 0, length = keys.length; i < length; i++) {
                results.push(iterator.call(hasContext ? context : obj[keys[i]], obj[keys[i]], keys[i], obj));
            }
        }

        return results;
    }

    function filter(obj, iterator, context) {
        var results = [],
            hasContext = context === void 0 ? false : true;

        each(obj, function (value, index, list) {
            if (iterator.call(hasContext ? context : value, value, index, list)) results.push(value);
        });

        return results;
    }

    function compact(array) {
        return filter(array, identity);
    }

    function indexOf(array, item) {
        var i = 0,
            length = array && array.length;

        for (; i < length; i++) {
            if (array[i] === item) return i;
        }return -1;
    }

    function contains(array, item) {
        return indexOf(array, item) >= 0;
    }

    function uniq(array) {
        if (array == null) return [];

        var result = [];

        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i];

            if (!contains(result, value)) {
                result.push(value);
            }
        }

        return result;
    }

    function range(start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }

        step = step || 1;

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    }

    function bind(func, context) {
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!isFunction(func)) throw new TypeError('Bind must be called on a function');

        return function () {
            return func.apply(context, arguments);
        };
    }

    function delay(func, wait) {
        var args = slice.call(arguments, 2);

        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };

    var _util = {};
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    each(['Arguments', 'Function', 'Date', 'RegExp', 'Error'], function (name) {
        _util['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_util.isArguments(arguments)) {
        _util.isArguments = function (obj) {
            return has(obj, 'callee');
        };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    if (typeof /./ != 'function' && (typeof Int8Array === 'undefined' ? 'undefined' : _typeof(Int8Array)) != 'object') {
        _util.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    var isArguments = exports.isArguments = _util.isArguments;
    var isFunction = exports.isFunction = _util.isFunction;
    var isDate = exports.isDate = _util.isDate;
    var isRegExp = exports.isRegExp = _util.isRegExp;
    var isError = exports.isError = _util.isError;
});