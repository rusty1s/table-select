'use strict';

/*
 * shouldSelectRowAtIndex(row, index)
 * willSelectRowAtIndex(row, index)
 * didSelectRowAtIndex(row, index)
 * shouldDeselectRowAtIndex(row, index)
 * willDeselectRowAtIndex(row, index)
 * didDeselectRowAtIndex(row, index)
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  shouldSelectRowAtIndex: function shouldSelectRowAtIndex() {
    return true;
  },
  willSelectRowAtIndex: function willSelectRowAtIndex() {},
  didSelectRowAtIndex: function didSelectRowAtIndex() {},
  shouldDeselectRowAtIndex: function shouldDeselectRowAtIndex() {
    return true;
  },
  willDeselectRowAtIndex: function willDeselectRowAtIndex() {},
  didDeselectRowAtIndex: function didDeselectRowAtIndex() {}
};

var TableSelect = function () {
  function TableSelect(element) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, TableSelect);

    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    Object.assign(this, defaultOptions, options, { element: element });

    this.init();
  }

  _createClass(TableSelect, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.element.classList.add('selectable');
      this.getRows().forEach(function (row) {
        return _this.initRow(row);
      });
    }
  }, {
    key: 'initRow',
    value: function initRow(row) {
      var _this2 = this;

      row.addEventListener('click', function () {
        _this2.getSelectedRows().forEach(function (r) {
          return _this2.deselectRow(r);
        });
        _this2.selectRow(row);
      });
    }
  }, {
    key: 'getRows',
    value: function getRows() {
      return Array.from(this.element.querySelector('tbody').children);
    }
  }, {
    key: 'getIndexOfRow',
    value: function getIndexOfRow(row) {
      return this.getRows().indexOf(row);
    }
  }, {
    key: 'isRowSelected',
    value: function isRowSelected(row) {
      return row.classList.contains('selected');
    }
  }, {
    key: 'getSelectedRows',
    value: function getSelectedRows() {
      var _this3 = this;

      return this.getRows().filter(function (row) {
        return _this3.isRowSelected(row);
      });
    }
  }, {
    key: 'selectRow',
    value: function selectRow(row) {
      if (!this.isRowSelected(row)) {
        var index = this.getIndexOfRow(row);
        if (this.shouldSelectRowAtIndex(row, index)) {
          this.willSelectRowAtIndex(row, index);
          row.classList.add('selected');
          this.didSelectRowAtIndex(row, index);
        }
      }
    }
  }, {
    key: 'deselectRow',
    value: function deselectRow(row) {
      if (this.isRowSelected(row)) {
        var index = this.getIndexOfRow(row);
        if (this.shouldDeselectRowAtIndex(row, index)) {
          this.willDeselectRowAtIndex(row, index);
          row.classList.remove('selected');
          this.didDeselectRowAtIndex(row, index);
        }
      }
    }
  }]);

  return TableSelect;
}();

window.TableSelect = TableSelect;
