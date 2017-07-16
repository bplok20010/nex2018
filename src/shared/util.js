 'use strict';
 var ArrayProto = Array.prototype,
     ObjProto = Object.prototype,
     FuncProto = Function.prototype;

 var
     push = ArrayProto.push,
     slice = ArrayProto.slice,
     concat = ArrayProto.concat,
     toString = ObjProto.toString,
     hasOwnProperty = ObjProto.hasOwnProperty;

 var
     nativeIsArray = Array.isArray,
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


 export function isString(obj) {
     return typeof obj === 'string';
 }

 export function isNumber(obj) {
     return typeof obj === 'number';
 }

 export var isArray = nativeIsArray ? nativeIsArray : function(value) {
     return toString.call(value) === '[object Array]';
 }

 export function isNull(obj) {
     return obj === null;
 }

 export function isTrue(obj) {
     return obj === true;
 }

 export function isUndefined(obj) {
     return obj === undefined;
 }

 export function isDefined(obj) {
     return obj !== undefined;
 }

 export function isStringOrNumber(obj) {
     return isString(obj) || isNumber(obj);
 }

 export function isNullOrUndef(obj) {
     return isUndefined(obj) || isNull(obj);
 }

 export function isInvalid(obj) {
     return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
 }

 export function isEmpty(value, allowEmptyString) {
     return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (isArray(value) && value.length === 0) || (isObject(value) && isEmptyObject(value));
     //return (!allowEmptyString ? value === '' : false) || isEmpty(value);
 }

 export function isPromiseLike(promise) {
     return promise && isFunction(promise.then);
 }

 export function isWindow(obj) {
     return obj != null && obj == obj.window;
 }

 export function isEmptyObject(obj) {
     var name;
     for (name in obj) {
         return false;
     }
     return true;
 }

 export function throwError(message) {
     if (!message) {
         message = 'a runtime error occured!';
     }
     throw new Error(`Neact Error: ${ message }`);
 }

 export function warning(message) {
     console && console.warn(message);
 }

 export function isArrayLike(obj) {
     var length = obj == null ? void 0 : obj.length;
     return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
 }

 export var isObject = (toString.call(null) === '[object Object]') ?
     function(value) {
         // check ownerDocument here as well to exclude DOM nodes
         return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
     } :
     function(value) {
         return toString.call(value) === '[object Object]';
     };

 export var now = Date.now || function() {
     return new Date().getTime();
 }

 export function identity(value) {
     return value;
 }

 export function has(obj, key) {
     return obj != null && hasOwnProperty.call(obj, key);
 }

 export function keys(obj) {
     if (!isObject(obj)) return [];

     if (nativeKeys) return nativeKeys(obj);

     var keys = [];

     for (var key in obj)
         if (has(obj, key)) keys.push(key);

     return keys;
 }

 export function extend(dest, sources) {
     if (!dest) { dest = {}; }
     for (var i = 1, l = arguments.length; i < l; i++) {
         _extend(dest, arguments[i]);
     }
     return dest;
 }

 export function extendIf(dest, sources) {
     var i = 1,
         l = arguments.length,
         prop;

     if (!dest) { dest = {}; }

     for (; i < l; i++) {
         for (prop in arguments[i]) {
             if (dest[prop] === undefined) {
                 dest[prop] = arguments[i][prop];
             }
         }
     }

     return dest;
 }

 export function values(obj) {
     var keys = keys(obj);
     var length = keys.length;
     var values = Array(length);

     for (var i = 0; i < length; i++) {
         values[i] = obj[keys[i]];
     }

     return values;
 }

 export function noop() {}

 export function toArray(obj) {
     if (!obj) return [];
     if (isArray(obj)) return slice.call(obj);
     if (isArrayLike(obj)) return map(obj, identity);

     return values(obj);
 }

 export function each(obj, iterator, context) {
     if (obj == null) return obj;

     var i, length, hasContext = context === void 0 ? false : true;

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

 export var forEach = each;

 export function map(obj, iterator, context) {
     if (obj == null) return obj;

     var i, length, results = [],
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

 export function filter(obj, iterator, context) {
     var results = [],
         hasContext = context === void 0 ? false : true;

     each(obj, function(value, index, list) {
         if (iterator.call(hasContext ? context : value, value, index, list)) results.push(value);
     });

     return results;
 }

 export function compact(array) {
     return filter(array, identity);
 }

 export function indexOf(array, item) {
     var i = 0,
         length = array && array.length;

     for (; i < length; i++)
         if (array[i] === item) return i;

     return -1;
 }

 export function contains(array, item) {
     return indexOf(array, item) >= 0;
 }

 export function uniq(array) {
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

 export function range(start, stop, step) {
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

 export function bind(func, context) {
     if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
     if (!isFunction(func)) throw new TypeError('Bind must be called on a function');

     return function() {
         return func.apply(context, arguments);
     };
 }
 
 export function delay(func, wait) {
     var args = slice.call(arguments, 2);

     return setTimeout(function() {
         return func.apply(null, args);
     }, wait);
 };

 var _util = {};
 // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
 each(['Arguments', 'Function', 'Date', 'RegExp', 'Error'], function(name) {
     _util['is' + name] = function(obj) {
         return toString.call(obj) === '[object ' + name + ']';
     };
 });

 // Define a fallback version of the method in browsers (ahem, IE < 9), where
 // there isn't any inspectable "Arguments" type.
 if (!_util.isArguments(arguments)) {
     _util.isArguments = function(obj) {
         return has(obj, 'callee');
     };
 }

 // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
 // IE 11 (#1621), and in Safari 8 (#1929).
 if (typeof /./ != 'function' && typeof Int8Array != 'object') {
     _util.isFunction = function(obj) {
         return typeof obj == 'function' || false;
     };
 }

 export var isArguments = _util.isArguments;
 export var isFunction = _util.isFunction;
 export var isDate = _util.isDate;
 export var isRegExp = _util.isRegExp;
 export var isError = _util.isError;