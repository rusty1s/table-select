/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _last = __webpack_require__(1);

	var _last2 = _interopRequireDefault(_last);

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.setDefaultOptions = setDefaultOptions;

	var _dispatch = __webpack_require__(2);

	var dispatch = _interopRequireWildcard(_dispatch);

	var _keydown = __webpack_require__(4);

	var _focus = __webpack_require__(6);

	var _mousedown = __webpack_require__(7);

	var _click = __webpack_require__(8);

	var _doubleclick = __webpack_require__(9);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @param {string} className - The class name of the table.
	 * Default: 'selectable'.
	 * @param {number} tabIndex - The tab index of the table. Default: 1.
	 * @param {string} selectedClassName - The class name of a selected row.
	 * Default: 'selected'.
	 * @param {Function} shouldSelectRow(row) - Function that determines whether
	 * `row` is selectable. Default: All rows can be selected.
	 * @param {Function} shouldDeselectRow(row) - Function that determines whether.
	 * `row` is deselectable. Default: All rows can be deselected.
	 */
	var defaultOptions = {
	  className: 'selectable',
	  tabIndex: 1,
	  selectedClassName: 'selected',
	  shouldSelectRow: function shouldSelectRow() {
	    return true;
	  },
	  shouldDeselectRow: function shouldDeselectRow() {
	    return true;
	  }
	};

	/**
	 * Allows to select table row elements.
	 */

	var TableSelect = function () {
	  /**
	   * @constructor
	   * @param {HTMLTableElement} element - The table which should be selectable.
	   * @param {Object} options - Specific options for this instance.
	   */

	  function TableSelect(element) {
	    var _this = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, TableSelect);

	    if (!element || element.tagName !== 'TABLE') {
	      throw new Error('Element must be a table');
	    }

	    if (!element.querySelector('tbody')) {
	      throw new Error('Element must contain a \'tbody\' element');
	    }

	    Object.assign(this, defaultOptions, options, { element: element });

	    this.element.classList.add(this.className);
	    this.element.tabIndex = this.tabIndex;

	    // private helper
	    this._lastSelectedRows = [];
	    this._onKeyDown = _keydown.onKeyDown.bind(this);
	    this._onFocusOut = _focus.onFocusOut.bind(this);
	    this._onMouseDown = _mousedown.onMouseDown.bind(this);

	    // add events
	    this.element.addEventListener('keydown', this._onKeyDown);
	    this.element.addEventListener('focusout', this._onFocusOut);
	    this.element.addEventListener('mousedown', this._onMouseDown);

	    this.rows().forEach(function (row) {
	      row.addEventListener('click', (0, _click.onClickRow)(row).bind(_this));
	      row.addEventListener('dblclick', (0, _doubleclick.onDoubleClickRow)(row).bind(_this));
	    });
	  }

	  /**
	   * Destroys the functionality of the selection and resets the table
	   * to its pre state.
	   */


	  _createClass(TableSelect, [{
	    key: 'destroy',
	    value: function destroy() {
	      var _this2 = this;

	      this.element.classList.remove(this.className);
	      this.element.tabIndex = null;

	      // remove events
	      this.element.removeEventListener('keydown', this._onKeyPress);
	      this.element.removeEventListener('focusout', this._onFocusOut);
	      this.element.removeEventListener('mousedown', this._onMouseDown);

	      this.rows().forEach(function (row) {
	        _this2.deselectRow(row);
	        row.removeEventListener('click');
	        row.removeEventListener('dblclick');
	      });

	      // delete everything that is bound to `this`
	      Object.keys(this).forEach(function (name) {
	        _this2[name] = null;
	      });
	    }

	    /**
	     * Returns the rows in the table.
	     * @returns {Array} - Array of HTMLTableRowElements.
	     */

	  }, {
	    key: 'rows',
	    value: function rows() {
	      return Array.from(this.element.querySelector('tbody').children);
	    }

	    /**
	     * Checks if the row is selected.
	     * @param {HTMLTableRowElement} row
	     * @returns {boolean}
	     */

	  }, {
	    key: 'isRowSelected',
	    value: function isRowSelected(row) {
	      if (!row) return false;
	      return row.classList.contains(this.selectedClassName);
	    }

	    /**
	     * Returns the selected rows in the table.
	     * @returns {Array} - Array of HTMLTableRowElements.
	     */

	  }, {
	    key: 'selectedRows',
	    value: function selectedRows() {
	      var _this3 = this;

	      return this.rows().filter(function (row) {
	        return _this3.isRowSelected(row);
	      });
	    }

	    /**
	     * Returns the last (explicitly) selected row in the table.
	     * Returns `null` if no row is (explicitly) selected.
	     * @returns {HTMLTableRowElement}
	     */

	  }, {
	    key: 'lastSelectedRow',
	    value: function lastSelectedRow() {
	      return (0, _last2.default)(this._lastSelectedRows);
	    }

	    /**
	     * Checks if the row is selectable.
	     * @param {HTMLTableRowElement} row
	     * @returns {boolean}
	     */

	  }, {
	    key: 'selectableRow',
	    value: function selectableRow(row) {
	      if (row && row.nodeType === 3) return false;
	      if (row && !this.shouldSelectRow(row)) return false;

	      return true;
	    }

	    /**
	     * Returns the next row of `row` which can be selected.
	     * Returns `null` if `row` is the last element in the table
	     * which can be selected.
	     * @param {HTMLTableRowElement} row
	     * @returns {HTMLTableRowElement}
	     */

	  }, {
	    key: 'nextRow',
	    value: function nextRow(row) {
	      if (!row) return null;

	      var nextRow = row.nextSibling;
	      while (nextRow && !this.selectableRow(nextRow)) {
	        nextRow = nextRow.nextSibling;
	      }

	      return nextRow;
	    }

	    /**
	     * Returns the previous row of `row` which can be selected.
	     * Returns `null` if `row` is the first element in the table
	     * which can be selected.
	     * @param {HTMLTableRowElement} row
	     * @returns {HTMLTableRowElement}
	     */

	  }, {
	    key: 'previousRow',
	    value: function previousRow(row) {
	      if (!row) return null;

	      var previousRow = row.previousSibling;
	      while (previousRow && !this.selectableRow(previousRow)) {
	        previousRow = previousRow.previousSibling;
	      }

	      return previousRow;
	    }

	    /**
	     * Returns the position of the row in the table.
	     * Returns `-1` if the row don't occur in the table.
	     * @param {HTMLTableRowElement} row
	     * @returns {number}
	     */

	  }, {
	    key: 'indexOfRow',
	    value: function indexOfRow(row) {
	      return this.rows().indexOf(row);
	    }

	    /**
	     * Select a row.
	     * @param {HTMLTableRowElement} row
	     * @param expand - Already selected rows get not deselected. Default: false.
	     * @param saveAsLastSelected - Explicitly save this row as last selected.
	     * Default: true.
	     */

	  }, {
	    key: 'selectRow',
	    value: function selectRow(row) {
	      var _this4 = this;

	      var expand = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      var saveAsLastSelected = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	      if (!row) return;
	      if (!this.shouldSelectRow(row)) return;

	      if (!expand) {
	        // deselect all rows except `row`
	        this.selectedRows().filter(function (r) {
	          return r !== row;
	        }).forEach(function (r) {
	          return _this4.deselectRow(r);
	        });
	      }

	      // deselect all rows except `row`
	      var index = this._lastSelectedRows.indexOf(row);
	      if (index >= 0) this._lastSelectedRows.splice(index, 1);

	      if (saveAsLastSelected) this._lastSelectedRows.push(row);

	      if (!this.isRowSelected(row)) {
	        dispatch.beforeSelect(this.element, row);
	        row.classList.add(this.selectedClassName);
	        dispatch.afterSelect(this.element, row);
	      }
	    }

	    /**
	     * Deselects a row.
	     * @param {HTMLTableRowElement} row
	     */

	  }, {
	    key: 'deselectRow',
	    value: function deselectRow(row) {
	      if (!row) return;
	      if (!this.shouldSelectRow(row)) return;

	      // deselect all rows except `row`
	      var index = this._lastSelectedRows.indexOf(row);
	      if (index >= 0) this._lastSelectedRows.splice(index, 1);

	      if (this.isRowSelected(row)) {
	        dispatch.beforeDeselect(this.element, row);
	        row.classList.remove(this.selectedClassName);
	        dispatch.afterDeselect(this.element, row);
	      }
	    }

	    /**
	     * Toggles the selection of a row.
	     * @param {HTMLTableRowElement} row
	     * @param expand - Already selected rows get not deselected. Default: false.
	     * @param saveAsLastSelected - Explicitly save this row as last selected.
	     * Default: true.
	     */

	  }, {
	    key: 'toggleRow',
	    value: function toggleRow(row) {
	      var expand = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      var saveAsLastSelected = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	      if (!this.isRowSelected(row)) {
	        this.selectRow(row, expand, saveAsLastSelected);
	      } else {
	        this.deselectRow(row);
	      }
	    }

	    /**
	     * Select all rows.
	     */

	  }, {
	    key: 'selectAll',
	    value: function selectAll() {
	      var _this5 = this;

	      this.rows().forEach(function (row) {
	        return _this5.selectRow(row, true, false);
	      });
	    }

	    /**
	     * Deselects all rows.
	     */

	  }, {
	    key: 'deselectAll',
	    value: function deselectAll() {
	      var _this6 = this;

	      this.rows().forEach(function (row) {
	        return _this6.deselectRow(row);
	      });
	    }

	    /**
	     * Selects a range of rows from the last selected row to `row`.
	     * @param {HTMLTableRowElement} row
	     * @param expand - Already selected rows get not deselected. Default: false.
	     */

	  }, {
	    key: 'selectRange',
	    value: function selectRange(row) {
	      var _this7 = this;

	      var expand = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      var rows = this.rows();
	      var lastSelectedRow = this.lastSelectedRow();
	      var rowIndex = this.indexOfRow(row);
	      var lastSelectedRowIndex = this.indexOfRow(lastSelectedRow);
	      if (lastSelectedRowIndex < 0) lastSelectedRowIndex = 0;

	      var index1 = Math.min(rowIndex, lastSelectedRowIndex); // min
	      var index2 = Math.max(rowIndex, lastSelectedRowIndex); // max

	      if (!expand) {
	        // deselect all rows except the rows in the range [index1, index2]
	        [].concat(_toConsumableArray(rows.slice(0, index1)), _toConsumableArray(rows.slice(index2 + 1, rows.length))).forEach(function (r) {
	          return _this7.deselectRow(r);
	        });
	      }

	      // dont repeat selecting `lastSelectedRow`, thus shift the indices
	      // if necessary
	      if (lastSelectedRowIndex < rowIndex) {
	        index1++;
	        index2++;
	      }

	      rows.slice(index1, index2).forEach(function (r) {
	        _this7.selectRow(r, true, false);
	      });
	    }

	    /**
	     * Triggers the action event on all selected rows.
	     */

	  }, {
	    key: 'action',
	    value: function action() {
	      if (this.selectedRows().length > 0) {
	        dispatch.action(this.element, this.selectedRows());
	      }
	    }
	  }]);

	  return TableSelect;
	}();

	/**
	 * Overrides the default options.
	 * @param {object} options
	 */


	exports.default = TableSelect;
	function setDefaultOptions(options) {
	  Object.assign(defaultOptions, options);
	}

	if (window) window.TableSelect = TableSelect;

/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.action = action;
	exports.beforeSelect = beforeSelect;
	exports.afterSelect = afterSelect;
	exports.beforeDeselect = beforeDeselect;
	exports.afterDeselect = afterDeselect;

	var _customEvent = __webpack_require__(3);

	var _customEvent2 = _interopRequireDefault(_customEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Returns the details of `row` which get sent to events.
	 * @param {HTMLTableRowElement} row
	 * @returns {Object}
	 * @private
	 */
	function rowDetail(row) {
	  return {
	    detail: {
	      row: row
	    }
	  };
	}

	/**
	 * Returns the details of all selected rows which get sent to events.
	 * @returns {Object}
	 * @private
	 */
	function rowDetails(rows) {
	  return {
	    detail: {
	      rows: rows
	    }
	  };
	}

	/**
	 * Triggers the `action` event on `element` with details `rows`.
	 * @param {HTMLTableElement} element
	 * @param {Array} rows - Array of HTMLTableRowElements.
	 */
	function action(element, rows) {
	  element.dispatchEvent(new _customEvent2.default('action', rowDetails(rows)));
	}

	/**
	 * Triggers the `beforeSelect` event on `element` with details `row`.
	 * @param {HTMLTableElement} element
	 * @param {HTMLTableRowElement} row
	 */
	function beforeSelect(element, row) {
	  element.dispatchEvent(new _customEvent2.default('beforeSelect', rowDetail(row)));
	}

	/**
	 * Triggers the `afterSelect` event on `element` with details `row`.
	 * @param {HTMLTableElement} element
	 * @param {HTMLTableRowElement} row
	 */
	function afterSelect(element, row) {
	  element.dispatchEvent(new _customEvent2.default('afterSelect', rowDetail(row)));
	}

	/**
	 * Triggers the `beforeDeselect` event on `element` with details `row`.
	 * @param {HTMLTableElement} element
	 * @param {HTMLTableRowElement} row
	 */
	function beforeDeselect(element, row) {
	  element.dispatchEvent(new _customEvent2.default('beforeDeselect', rowDetail(row)));
	}

	/**
	 * Triggers the `afterDeselect` event on `element` with details `row`.
	 * @param {HTMLTableElement} element
	 * @param {HTMLTableRowElement} row
	 */
	function afterDeselect(element, row) {
	  element.dispatchEvent(new _customEvent2.default('afterDeselect', rowDetail(row)));
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _head = __webpack_require__(5);

	var _head2 = _interopRequireDefault(_head);

	var _last = __webpack_require__(1);

	var _last2 = _interopRequireDefault(_last);

	exports.onKeyDown = onKeyDown;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * The arrow up behaviour.
	 * @param event
	 */
	function arrowUp(event) {
	  if (!event.shiftKey || !this.lastSelectedRow()) {
	    // `row` is the next row to be selected
	    // => last row in the table or the previous row of the last selected row
	    var row = (0, _last2.default)(this.rows());
	    if (this.lastSelectedRow()) row = this.previousRow(this.lastSelectedRow());

	    while (row && this.isRowSelected(row)) {
	      row = this.previousRow(row);
	    }

	    this.selectRow(row || (0, _head2.default)(this.rows()), false, true);
	  } else {
	    // shift arrow up
	    var _row = this.lastSelectedRow();

	    // check if there exists a selected range event to next rows
	    // => arrow up performs a deselecting at the bottom of the range
	    var nextRow = this.nextRow(_row);
	    while (nextRow && this.isRowSelected(nextRow)) {
	      nextRow = this.nextRow(nextRow);
	    }

	    var index = this.rows().length - 1;
	    if (nextRow && _row !== this.previousRow(nextRow)) {
	      this.deselectRow(this.previousRow(nextRow));
	      return;
	    } else if (!nextRow && this.indexOfRow(this.lastSelectedRow()) !== index) {
	      this.deselectRow((0, _last2.default)(this.rows()));
	      return;
	    }

	    // otherwise: run up the selection to top and find the row
	    // that is about to get selected
	    var previousRow = this.previousRow(_row);
	    while (previousRow && this.isRowSelected(previousRow)) {
	      previousRow = this.previousRow(previousRow);
	    }

	    this.selectRow(previousRow, true, false);
	  }
	}

	/**
	 * The arrow down behaviour.
	 * @param event
	 */
	function arrowDown(event) {
	  if (event.ctrlKey || event.metaKey) {
	    // perform action and abort
	    this.action();
	    return;
	  }

	  if (!event.shiftKey || !this.lastSelectedRow()) {
	    // `row` is the next row to be selected
	    // => first row in the table or the next row of the last selected row
	    var row = (0, _head2.default)(this.rows());
	    if (this.lastSelectedRow()) row = this.nextRow(this.lastSelectedRow());

	    while (row && this.isRowSelected(row)) {
	      row = this.nextRow(row);
	    }

	    this.selectRow(row || (0, _last2.default)(this.rows()), false, true);
	  } else {
	    // shift arrow down
	    var _row2 = this.lastSelectedRow();

	    // check if there exists a selected range event to previous rows
	    // => arrow down performs a deselecting at the top of the range
	    var previousRow = this.previousRow(_row2);
	    while (previousRow && this.isRowSelected(previousRow)) {
	      previousRow = this.previousRow(previousRow);
	    }

	    if (previousRow && _row2 !== this.nextRow(previousRow)) {
	      this.deselectRow(this.nextRow(previousRow));
	      return;
	    } else if (!previousRow && this.indexOfRow(this.lastSelectedRow()) !== 0) {
	      this.deselectRow((0, _head2.default)(this.rows()));
	      return;
	    }

	    // otherwise: run down the selection to bottom and find the row
	    // that is about to get selected
	    var nextRow = this.nextRow(_row2);
	    while (nextRow && this.isRowSelected(nextRow)) {
	      nextRow = this.nextRow(nextRow);
	    }

	    this.selectRow(nextRow, true, false);
	  }
	}

	/**
	 * The key down table behaviour (arrow up, arrow down and enter).
	 */
	function onKeyDown(event) {
	  if (event.keyCode === 38) arrowUp.call(this, event); // arrow up
	  else if (event.keyCode === 40) arrowDown.call(this, event); // arrow down
	    else if (event.keyCode === 13) this.action(); // enter
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Gets the first element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @alias first
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the first element of `array`.
	 * @example
	 *
	 * _.head([1, 2, 3]);
	 * // => 1
	 *
	 * _.head([]);
	 * // => undefined
	 */
	function head(array) {
	  return array ? array[0] : undefined;
	}

	module.exports = head;


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * The focus out table behaviour.
	 */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onFocusOut = onFocusOut;
	function onFocusOut() {
	  this.deselectAll();
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Clears the selection in the document.
	 */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onMouseDown = onMouseDown;
	function clearSelection() {
	  var selection = window.getSelection ? window.getSelection() : document.selection;

	  if (selection) {
	    if (selection.removeAllRanges) selection.removeAllRanges();else if (selection.empty) selection.empty();
	  }
	}

	/**
	 * Clears the selection in the document on mouse down
	 * when the shift key is pressed.
	 * @param event
	 */
	function onMouseDown(event) {
	  if (event.shiftKey) {
	    clearSelection();
	  }
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Returns the click behaviour for a row.
	 * @param {HTMLTableRowElement} row
	 * @returns {Function}
	 */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onClickRow = onClickRow;
	function onClickRow(row) {
	  return function onClick(event) {
	    if (event.shiftKey) {
	      this.selectRange(row, event.ctrlKey || event.metaKey);
	    } else {
	      if (event.ctrlKey || event.metaKey) this.toggleRow(row, true, true);else this.selectRow(row, false, true);
	    }
	  };
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Returns the double click behaviour for a row.
	 * @param {HTMLTableRowElement} row
	 * @returns {Function}
	 */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onDoubleClickRow = onDoubleClickRow;
	function onDoubleClickRow(row) {
	  return function onDoubleClick(event) {
	    if (!this.shouldSelectRow(row)) return;

	    if (event.ctrlKey || event.metaKey) {
	      this.selectRow(row, true, true);
	    }

	    this.action();
	  };
	}

/***/ }
/******/ ]);