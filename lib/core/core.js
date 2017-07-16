'use strict';

exports.__esModule = true;
exports.Create = exports.Class = undefined;
exports.define = define;
exports.create = create;

var _declare = require('./declare/declare');

var _declare2 = _interopRequireDefault(_declare);

var _util = require('../shared/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var XTYPES = {};

var Classes = {};

function fixMixins(props) {
    var mixin = props.mixins;
    if (mixin) {
        if ((0, _util.isString)(mixin) && Classes.hasOwnProperty(mixin)) {
            props.mixins = Classes[mixin];
        } else if ((0, _util.isArray)(mixin)) {
            for (var i = 0; i < mixin.length; i++) {
                if ((0, _util.isString)(mixin[i]) && Classes.hasOwnProperty(mixin[i])) {
                    props.mixins[i] = Classes[mixin[i]];
                }
            }
        }
    }
}

function define(className, superClass, props) {
    var defineClass, xtype;
    switch (arguments.length) {
        case 0:
            defineClass = (0, _declare2['default'])();
            break;
        case 1:
            if ((0, _util.isObject)(className)) {
                xtype = className.xtype;
                delete className.xtype;
                fixMixins(className);
            }
            defineClass = (0, _declare2['default'])(className);
            break;
        case 2:
            if ((0, _util.isString)(superClass) && Classes.hasOwnProperty(superClass)) {
                superClass = Classes[superClass];
            } else if ((0, _util.isObject)(superClass)) {
                xtype = superClass.xtype;
                delete superClass.xtype;
                fixMixins(superClass);
            }
            defineClass = (0, _declare2['default'])(className, superClass);
            break;
        case 3:
            if ((0, _util.isString)(superClass) && Classes.hasOwnProperty(superClass)) {
                superClass = Classes[superClass];
            }
            if ((0, _util.isObject)(props)) {
                xtype = props.xtype;
                delete props.xtype;
                fixMixins(props);
            }
            defineClass = (0, _declare2['default'])(className, superClass, props);
            break;
    }

    if (xtype) {
        XTYPES[xtype] = defineClass;
    }

    if (defineClass.displayName !== 'anonymous') {
        Classes[defineClass.displayName] = defineClass;
    }

    defineClass.setOptions = defineClass.setDefaultConfig;

    return defineClass;
}

var Class = exports.Class = define;

var createClass = function (Class, arg1) {
    function cloneFn(fn) {
        var ctor = function () {};
        ctor.prototype = fn.prototype;
        return ctor;
    }
    return function () {
        var argvs = (0, _util.toArray)(arguments);
        var Class = argvs[0];
        var Args = argvs.slice(1);

        if (typeof Class != 'function') {
            throw new TypeError('create class error. the first parameter is not a function');
        }

        var instance = new (cloneFn(Class))();
        Class.apply(instance, Args);
        return instance;
    };
}();

function create() {
    var argvs = (0, _util.toArray)(arguments);

    var Class = argvs[0];
    var params = argvs.slice(1);

    var len = argvs.length;
    if (len <= 0) {
        throw new TypeError('create error. missing parameter!');
    }

    if (Class.$isInstance) {
        return Class;
    }

    if ((0, _util.isFunction)(Class)) {
        return createClass.apply(null, argvs);
    }

    if ((0, _util.isString)(Class) && Classes.hasOwnProperty(Class)) {
        Class = Classes[Class];
        return createClass.apply(null, [Class].concat(params));
    }

    if ((0, _util.isString)(Class) && XTYPES.hasOwnProperty(Class)) {
        Class = XTYPES[Class];
        return createClass.apply(null, [Class].concat(params));
    }

    throw new TypeError('create error. unknown error!');
}

var Create = exports.Create = create;