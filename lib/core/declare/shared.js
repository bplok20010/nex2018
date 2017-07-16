'use strict';

exports.__esModule = true;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.isNullOrUndef = isNullOrUndef;
exports.isObject = isObject;
exports.assign = assign;
var toString = Object.prototype.toString;

function isFunction(obj) {
    return toString.call(obj) === '[object Function]';
}

function isArray(obj) {
    return toString.call(obj) === '[object Array]';
}

function isNullOrUndef(s) {
    return s === null || s === undefined;
}

function isObject(s) {
    return toString.call(s) === '[object Object]';
}

function assign(target) {
    if (Object.assign) {
        return Object.assign.apply(Object, arguments);
    }

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty && source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                } else {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
}