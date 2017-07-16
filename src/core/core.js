'use strict';
import declare from './declare/declare';

import {
    isFunction,
    isString,
	isObject,
	isArray,
    toArray
} from '../shared/util';

var XTYPES = {};

var Classes = {};

function fixMixins(props){
	let mixin = props.mixins;
	if( mixin ) {
		if( isString(mixin) && Classes.hasOwnProperty(mixin) ) {
			props.mixins = 	Classes[mixin];
		} else if( isArray(mixin) ) {
			for( let i=0;i<mixin.length;i++ ) {
				if( isString(mixin[i]) && Classes.hasOwnProperty(mixin[i]) ) {
					props.mixins[i] = Classes[mixin[i]];
				}	
			}	
		}
	}
}

export function define(className, superClass, props) {
    var defineClass, xtype;
    switch (arguments.length) {
        case 0:
            defineClass = declare();
            break;
        case 1:
			if( isObject(className) ) {
				xtype = className.xtype;
				delete className.xtype;
				fixMixins(className);
			}
            defineClass = declare(className);
            break;
        case 2:
			if( isString(superClass) && Classes.hasOwnProperty(superClass) ) {
				superClass = Classes[superClass];
			} else if( isObject(superClass) ) {
				xtype = superClass.xtype;
				delete superClass.xtype;
				fixMixins(superClass);
			}
            defineClass = declare(className, superClass);
            break;
        case 3:
			if( isString(superClass) && Classes.hasOwnProperty(superClass) ) {
				superClass = Classes[superClass];
			}
			if( isObject(props) ) {
				xtype = props.xtype;
				delete props.xtype;
				fixMixins(props);
			}
            defineClass = declare(className, superClass, props);
            break
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

export const Class = define;

const createClass = (function(Class, arg1) {
    function cloneFn(fn) {
        var ctor = function() {};
        ctor.prototype = fn.prototype;
        return ctor;
    }
    return function() {
        var argvs = toArray(arguments);
        var Class = argvs[0];
        var Args = argvs.slice(1);

        if (typeof Class != 'function') {
            throw new TypeError('create class error. the first parameter is not a function');
        }

        var instance = new(cloneFn(Class));
        Class.apply(instance, Args);
        return instance;
    };
})();

export function create() {
    var argvs = toArray(arguments);

    var Class = argvs[0];
    var params = argvs.slice(1);

    var len = argvs.length;
    if (len <= 0) {
        throw new TypeError('create error. missing parameter!');
    }

    if (Class.$isInstance) {
        return Class;
    }

    if (isFunction(Class)) {
        return createClass.apply(null, argvs);
    }

    if (isString(Class) && Classes.hasOwnProperty(Class)) {
        Class = Classes[Class];
        return createClass.apply(null, [Class].concat(params));
    }

    if (isString(Class) && XTYPES.hasOwnProperty(Class)) {
        Class = XTYPES[Class];
        return createClass.apply(null, [Class].concat(params));
    }

    throw new TypeError('create error. unknown error!');
}

export const Create = create;