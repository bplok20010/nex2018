'use strict';
import {define} from './core';
import {
    isFunction,
    isString,
    isNumber,
    isNullOrUndef,
    filter,
    toArray,
    noop,
    each
} from '../shared/util';

export default define('EventObject', {

    constructor: function(props) {
        this.initConfig(props);
        this._eventMaps = {};
        this._eventIndex = 1;
        this._events = {};
        this.stopOnFalse = props.stopOnFalse === undefined ? true : props.stopOnFalse;
        this.initEventConfig();
    },

    initEventConfig: function() {
        var self = this,
            opt = this.config;

        each(opt, function(obj, event) {
            if (event.length > 2 && event[0] === 'o' && event[1] === 'n') {
                self.addListener(event.slice(2), obj);
            }
        });

    },

    addListener: function(type, func, context) {
        var self = this;
        var opt = self.config;
        var events = self._events;
        var eventMaps = self._eventMaps;

        if (!type || !isString(type)) {
            return false;
        }

        var _type = type.split(".");
        type = _type[0];
        _type = _type.slice(1);
        var ext = _type.join('.');

        if (!type) {
            return false;
        }

        //事件名映射处理
        if (type in eventMaps) {
            type = eventMaps[type];
        }

        events[type] = events[type] || [];

        if (!isFunction(func) || func === noop) {
            return false;
        }

        var e = {
            func: func,
            ext: ext,
            index: self._eventIndex++,
            context: context || self
        };

        self._toFirst ? events[type].unshift(e) : events[type].push(e);

        return e.index;
    },

    removeListener: function(type, id) {
        var self = this;
        var undef;
        var opt = self.config;
        var eventMaps = self._eventMaps;

        var events = self._events;

        //removeListener(3)
        if (isNumber(type)) {
            let idx = type;
            for (var tp in events) {
                self.removeListener(tp, idx);
            }
            return true;
        }

        if (!type || !isString(type)) {
            return false;
        }

        var _type = type.split(".");
        type = _type[0];
        _type = _type.slice(1);
        var ext = _type.join('.');
        //removeListener('.test');
        if (type === '' && ext !== '') {
            for (var tp in events) {
                self.removeListener([tp, ext].join('.'));
            }
            return true;
        }

        //事件名映射处理
        //eventMaps
        if (type in eventMaps) {
            type = eventMaps[type];
        }

        if (!(type in events)) {
            return false;
        }

        var listeners = this.listeners(type);

        if (isNullOrUndef(id)) {
            if (ext === '') {
                events[type] = [];
            } else {
                events[type] = filter(listeners, function(e, i) {
                    if (e.ext !== ext) {
                        return true;
                    }
                });
            }
        } else {
            events[type] = filter(listeners, function(e, i) {
                if (e.index !== id) {
                    return true;
                }
            });
        }

        return true;
    },

    listeners: function(event) {
        return this._events[event] || [];
    },

    emit: function(event) {
        var self = this;
        var opt = self.config;
        var eventMaps = self._eventMaps;

        var args = toArray(arguments);
        var event = args.shift();

        if (!event || !isString(event)) {
            return;
        }
        //事件名映射处理
        //eventMaps
        if (event in eventMaps) {
            event = eventMaps[event];
        }

        var listeners = self.listeners(event);

        //添加事件锁
        var eventLocks = self._eventLocks || {};
        if (eventLocks[event]) {
            return;
        }

        var r = true;
        var len = listeners.length;

        for (var i = 0; i < len; i++) {
            var e = listeners[i];
            r = e.func.apply(e.context || this, args);
            if (self.stopOnFalse) {
                if (r === false) break;
            }
        }

        return r;
    },
    one: function(event, func, context) {
        var self = this;
        var _ = function() {
                self.removeListener(_.id);
                return func.apply(this, arguments);
            },
            id = null;

        id = self.addListener(event, _, context);
        _.id = id;
        return id;
    },
    once: function() {
        return this.one.apply(this, arguments);
    },
    _toFirst: false,
    /**
     * 把事件绑定到顶端
     */
    addListenerToFirst: function() {
        this._toFirst = true;
        var ids = this.addListener.apply(this, arguments);
        this._toFirst = false;
        return ids;
    },
    lockEvent: function(eventType) {
        var self = this;
        //事件锁
        var eventLocks = self._eventLocks || {};
        eventLocks[eventType] = true;
        self._eventLocks = eventLocks;
        return true;
    },
    /*
     * 取消锁定事件
     *  @eventType {String} 事件名
     */
    unLockEvent: function(eventType) {
        var self = this;
        //事件锁
        var eventLocks = self._eventLocks || {};
        eventLocks[eventType] = false;
        self._eventLocks = eventLocks;
        return true;
    },
    on: function() {
        return this.addListener.apply(this, arguments);
    },
    off: function() {
        return this.removeListener.apply(this, arguments);
    },
    bind: function() {
        return this.addListener.apply(this, arguments);
    },
    unbind: function() {
        return this.removeListener.apply(this, arguments);
    },
    fireEvent: function() {
        return this.emit.apply(this, arguments);
    },
    fire: function() {
        return this.emit.apply(this, arguments);
    }
});