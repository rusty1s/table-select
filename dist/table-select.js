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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customEvent = require('custom-event');

var _customEvent2 = _interopRequireDefault(_customEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  className: 'selectable',
  selectedClassName: 'selected'
};

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

/*
export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}*/

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

    this.init();
  }

  _createClass(TableSelect, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.element.classList.add(this.className);
      this.rows().forEach(function (row) {
        return _this._initRow(row);
      });

      this.element.addEventListener('beforeSelect', function (event) {
        setTimeout(function () {
          if (!event.defaultPrevented) {
            event.detail.row.classList.add(_this.selectedClassName);

            _this.element.dispatchEvent(new _customEvent2.default('afterSelect', {
              detail: event.detail
            }));
          }
        });
      });

      this.element.addEventListener('beforeDeselect', function (event) {
        setTimeout(function () {
          if (!event.defaultPrevented) {
            event.detail.row.classList.remove(_this.selectedClassName);

            _this.element.dispatchEvent(new _customEvent2.default('afterDeselect', {
              detail: event.detail
            }));
          }
        });
      });
    }
  }, {
    key: '_initRow',
    value: function _initRow(row) {
      var _this2 = this;

      row.addEventListener('click', function (event) {
        if (event.shiftKey) {} else if (event.ctrlKey || event.metaKey) {
          _this2.toggleRow(row);
        } else {
          _this2.selectRowExclusive(row);
        }
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this3 = this;

      this.element.classList.remove(this.className);
      this.rows().forEach(function (row) {
        return _this3._destroyRow(row);
      });

      this.element.removeEventListener('beforeSelect');
      this.element.removeEventListener('beforeDeselect');
    }
  }, {
    key: '_destroyRow',
    value: function _destroyRow(row) {
      this.deselectRow(row);
      row.removeEventListener('click');
    }
  }, {
    key: 'rows',
    value: function rows() {
      return Array.from(this.element.querySelector('tbody').children);
    }
  }, {
    key: 'length',
    value: function length() {
      return this.rows().length;
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
      var _this4 = this;

      return this.rows().filter(function (row) {
        return _this4.isRowSelected(row);
      });
    }
  }, {
    key: 'selectedRowIndices',
    value: function selectedRowIndices() {
      var _this5 = this;

      return this.selectedRows().map(function (row) {
        return _this5.indexOfRow(row);
      });
    }
  }, {
    key: 'selectRow',
    value: function selectRow(row) {
      if (!this.isRowSelected(row)) {
        this.element.dispatchEvent(new _customEvent2.default('beforeSelect', {
          cancelable: true,
          detail: {
            row: row,
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
    key: 'toggleRow',
    value: function toggleRow(row) {
      if (!this.isRowSelected(row)) this.selectRow(row);else this.deselectRow(row);
    }
  }, {
    key: 'selectRowExclusive',
    value: function selectRowExclusive(row) {
      var _this7 = this;

      function deselectAllOthers() {
        var _this6 = this;

        this.selectedRows().filter(function (r) {
          return r !== row;
        }).forEach(function (r) {
          return _this6.deselectRow(r);
        });
      }
      var bindedDeselectAllOthers = deselectAllOthers.bind(this);

      this.element.addEventListener('afterSelect', bindedDeselectAllOthers);
      this.selectRow(row);
      setTimeout(function () {
        _this7.element.removeEventListener('afterSelect', bindedDeselectAllOthers);
      });
    }
  }, {
    key: 'selectAll',
    value: function selectAll() {
      var _this8 = this;

      this.rows().forEach(function (row) {
        return _this8.selectRow(row, true);
      });
    }
  }, {
    key: 'deselectAll',
    value: function deselectAll() {
      var _this9 = this;

      this.rows().forEach(function (row) {
        return _this9.deselectRow(row);
      });
    }
  }, {
    key: 'selectRangeFromLastSelectedToRow',
    value: function selectRangeFromLastSelectedToRow(row) {
      var expand = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (!this.lastSelectedRow) this.selectRow(row, expand);
    }
  }]);

  return TableSelect;
}();

window.TableSelect = TableSelect;
// export default TableSelect;

/*
Todo export and window
shift und strg, arrow and normal click
event listener löschen bei destroy
 */

},{"custom-event":1}]},{},[2]);
