'use strict';

exports.__esModule = true;
exports['default'] = wrap;
var HAS_SUPER_PATTERN = /\.(_super|call\(this|apply\(this)/;
var fnToString = Function.prototype.toString;

var checkHasSuper = function () {
  var sourceAvailable = fnToString.call(function () {
    return this;
  }).indexOf('return this') > -1;

  if (sourceAvailable) {
    return function checkHasSuper(func) {
      return HAS_SUPER_PATTERN.test(fnToString.call(func));
    };
  }

  return function checkHasSuper() {
    return true;
  };
}();

function ROOT() {}
ROOT.__hasSuper = false;

function hasSuper(func) {
  if (func.__hasSuper === undefined) {
    func.__hasSuper = checkHasSuper(func);
  }
  return func.__hasSuper;
}

/**
  Wraps the passed function so that `this._super` will point to the superFunc
  when the function is invoked. This is the primitive we use to implement
  calls to super.

  @private
  @method wrap
  @for Ember
  @param {Function} func The function to call
  @param {Function} superFunc The super function.
  @return {Function} wrapped function.
*/
function wrap(func, superFunc) {
  if (!hasSuper(func)) {
    return func;
  }
  // ensure an unwrapped super that calls _super is wrapped with a terminal _super
  if (!superFunc.wrappedFunction && hasSuper(superFunc)) {
    return _wrap(func, _wrap(superFunc, ROOT));
  }
  return _wrap(func, superFunc);
}

function _wrap(func, superFunc) {
  function superWrapper() {
    var orig = this._super;
    this._super = superFunc;
    var ret = func.apply(this, arguments);
    this._super = orig;
    return ret;
  }

  superWrapper.wrappedFunction = func;

  return superWrapper;
}