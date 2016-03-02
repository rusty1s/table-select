(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){

var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],3:[function(require,module,exports){
/*
 function clearSelection() {
 const selection = window.getSelection ?
 window.getSelection() :
 document.selection;
 if (selection) {
 if (selection.removeAllRanges) sel.removeAllRanges();
 else if (selection.empty) sel.empty();
 }
 }*/

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onClickRow = onClickRow;
function onClickRow(row) {
  return function onClick(event) {
    if (event.shiftKey) {
      this.selectRange(row, true);
    } else if (event.ctrlKey || event.metaKey) {
      if (!this.isRowSelected(row)) {
        this.selectRow(row, false, true);
        this._lastSelectedRows.push(row);
      } else {
        this.deselectRow(row);
        remove(this._lastSelectedRows, function (r) {
          return r === row;
        });
      }
    } else {
      this.selectRow(row, false, true);
      this._lastSelectedRows = [row];
    }
  };
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onFocusOut = onFocusOut;
function onFocusOut() {
  this.deselectAll();
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onKeyPress = onKeyPress;
function onKeyPress(event) {
  // up arrow
  if (event.keyCode === 38) {
    var previousRow = this.selectedRows().shift().previousSibling;
    while (previousRow !== null && previousRow.nodeType === 3) {
      previousRow = previousRow.previousSibling;
    }

    if (previousRow) this.selectRow(previousRow, false, true);
  }

  // down arrow
  if (event.keyCode === 40) {
    var nextRow = this.selectedRows().pop().nextSibling;
    while (nextRow !== null && nextRow.nodeType === 3) {
      nextRow = nextRow.nextSibling;
    }

    if (nextRow) this.selectRow(nextRow, false, true);
  }
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onBeforeSelect = onBeforeSelect;
exports.onBeforeDeselect = onBeforeDeselect;
function onBeforeSelect(event) {
  var _this = this;

  setTimeout(function () {
    if (!event.defaultPrevented) {
      event.detail.row.classList.add(_this.selectedClassName);

      _this.element.dispatchEvent(new CustomEvent('afterSelect', {
        detail: event.detail
      }));
    }
  });
}

function onBeforeDeselect(event) {
  var _this2 = this;

  setTimeout(function () {
    if (!event.defaultPrevented) {
      event.detail.row.classList.remove(_this2.selectedClassName);

      _this2.element.dispatchEvent(new CustomEvent('afterDeselect', {
        detail: event.detail
      }));
    }
  });
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setDefaultOptions = setDefaultOptions;

var _customEvent = require('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _select = require('./events/select');

var _keypress = require('./events/keypress');

var _focus = require('./events/focus');

var _click = require('./events/click');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 shift und strg, arrow and normal click
 action
 lodash nur arrow remove und last
 */

var defaultOptions = {
  className: 'selectable',
  selectedClassName: 'selected'
};

var TableSelect = function () {
  function TableSelect(element) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, TableSelect);

    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    if (!element.querySelector('tbody')) {
      throw new Error('Element must contain a \'tbody\' element');
    }

    Object.assign(this, defaultOptions, options, { element: element });

    this._init();
  }

  _createClass(TableSelect, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      this.element.classList.add(this.className);
      this._lastSelectedRows = [];

      this._onBeforeSelect = _select.onBeforeSelect.bind(this);
      this._onBeforeDeselect = _select.onBeforeDeselect.bind(this);
      this._onKeyPress = _keypress.onKeyPress.bind(this);
      this._onFocusOut = _focus.onFocusOut.bind(this);

      this.element.addEventListener('beforeSelect', this._onBeforeSelect);
      this.element.addEventListener('beforeDeselect', this._onBeforeDeselect);
      this.element.addEventListener('keydown', this._onKeyPress);
      this.element.addEventListener('focusout', this._onFocusOut);

      this.rows().forEach(function (row) {
        row.addEventListener('click', (0, _click.onClickRow)(row).bind(_this));
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.element.classList.remove(this.className);

      this.element.removeEventListener('beforeSelect', this._onBeforeSelect);
      this.element.removeEventListener('beforeDeselect', this._onBeforeDeselect);
      this.element.removeEventListener('keydown', this._onKeyPress);
      this.element.removeEventListener('focusout', this._onFocusOut);

      this.rows().forEach(function (row) {
        _this2.deselectRow(row);
        row.removeEventListener('click');
      });

      Object.keys(this).forEach(function (name) {
        _this2[name] = null;
      });
    }
  }, {
    key: 'rows',
    value: function rows() {
      return Array.from(this.element.querySelector('tbody').children);
    }
  }, {
    key: 'indexOfRow',
    value: function indexOfRow(row) {
      return this.rows().indexOf(row);
    }
  }, {
    key: 'isRowSelected',
    value: function isRowSelected(row) {
      return row.classList.contains(this.selectedClassName);
    }
  }, {
    key: 'selectedRows',
    value: function selectedRows() {
      var _this3 = this;

      return this.rows().filter(function (row) {
        return _this3.isRowSelected(row);
      });
    }
  }, {
    key: 'selectedRowIndices',
    value: function selectedRowIndices() {
      var _this4 = this;

      return this.selectedRows().map(function (row) {
        return _this4.indexOfRow(row);
      });
    }
  }, {
    key: 'nextSibling',
    value: function nextSibling(row) {
      var nextRow = row.nextSibling;
      while (nextRow !== null && nextRow.nodeType === 3) {
        nextRow = nextRow.nextSibling;
      }
      return nextRow;
    }
  }, {
    key: 'previousSibling',
    value: function previousSibling(row) {
      var previousRow = row.previousSibling;
      while (previousRow !== null && previousRow.nodeType === 3) {
        previousRow = previousRow.previousSibling;
      }
      return previousRow;
    }
  }, {
    key: 'selectRow',
    value: function selectRow(row) {
      var _this6 = this;

      var expand = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var explicitSelected = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      function deselectAllOthers() {
        var _this5 = this;

        this.selectedRows().filter(function (r) {
          return r !== row;
        }).forEach(function (r) {
          return _this5.deselectRow(r);
        });
      }

      if (!expand) {
        (function () {
          var boundDeselectAllOthers = deselectAllOthers.bind(_this6);
          _this6.element.addEventListener('afterSelect', boundDeselectAllOthers);
          setTimeout(function () {
            _this6.element.removeEventListener('afterSelect', boundDeselectAllOthers);
          }, 100);
        })();
      }

      if (!this.isRowSelected(row)) {
        this.element.dispatchEvent(new _customEvent2.default('beforeSelect', {
          cancelable: true,
          detail: {
            row: row,
            explicitSelected: explicitSelected,
            index: this.indexOfRow(row)
          }
        }));
      }
    }
  }, {
    key: 'deselectRow',
    value: function deselectRow(row) {
      if (this.isRowSelected(row)) {
        this.element.dispatchEvent(new _customEvent2.default('beforeDeselect', {
          cancelable: true,
          detail: {
            row: row,
            index: this.indexOfRow(row)
          }
        }));
      }
    }
  }, {
    key: 'selectAll',
    value: function selectAll() {
      var _this7 = this;

      this.rows().forEach(function (row) {
        return _this7.selectRow(row, true);
      });
    }
  }, {
    key: 'deselectAll',
    value: function deselectAll() {
      var _this8 = this;

      this.rows().forEach(function (row) {
        return _this8.deselectRow(row);
      });
    }
  }, {
    key: 'selectRange',
    value: function selectRange(row) {
      var expand = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      // console.log(this._lastSelectedRows);

      var rowIndex = this.indexOfRow(row);
      var otherRow = (0, _last2.default)(this._lastSelectedRows);
      var otherRowIndex = otherRow ? this.indexOfRow(otherRow) : 0;

      var firstRow = rowIndex < otherRowIndex ? row : otherRow;
      var diff = Math.abs(rowIndex - otherRowIndex);

      var currentRow = this.nextSibling(firstRow);
      for (var i = 0; i < diff; i++) {
        //console.log(currentRow);
        this.selectRow(currentRow, true, false);
        currentRow = this.nextSibling(currentRow);
      }
      this.rows().forEach(function (r) {
        //this.selectRow(r, true, false);
      });
    }
  }]);

  return TableSelect;
}();

exports.default = TableSelect;
function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.TableSelect = TableSelect;

},{"./events/click":3,"./events/focus":4,"./events/keypress":5,"./events/select":6,"custom-event":1,"lodash/last":2}]},{},[7]);
