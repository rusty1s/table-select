'use strict';

import last from 'lodash/last';

import * as dispatch from './events/dispatch';
import { onKeyDown } from './events/keydown';
import { onFocusOut } from './events/focus';
import { onMouseDown } from './events/mousedown';
import { onClickRow } from './events/click';
import { onDoubleClickRow } from './events/doubleclick';

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
const defaultOptions = {
  className: 'selectable',
  tabIndex: 1,
  selectedClassName: 'selected',
  shouldSelectRow() { return true; },
  shouldDeselectRow() { return true; },
};

/**
 * Allows to select table row elements.
 */
export default class TableSelect {
  /**
   * @constructor
   * @param {HTMLTableElement} element - The table which should be selectable.
   * @param {Object} options - Specific options for this instance.
   */
  constructor(element, options = {}) {
    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    if (!element.querySelector('tbody')) {
      throw new Error('Element must contain a \'tbody\' element');
    }

    Object.assign(this, defaultOptions, options, { element });

    this.element.classList.add(this.className);
    this.element.tabIndex = this.tabIndex;

    // private helper
    this._lastSelectedRows = [];
    this._onKeyDown = onKeyDown.bind(this);
    this._onFocusOut = onFocusOut.bind(this);
    this._onMouseDown = onMouseDown.bind(this);
    this._onClick = [];
    this._onDoubleClick = [];

    // add events
    this.element.addEventListener('keydown', this._onKeyDown);
    this.element.addEventListener('focusout', this._onFocusOut);
    this.element.addEventListener('mousedown', this._onMouseDown);

    this.rows().forEach(row => {
      const onClick = onClickRow(row).bind(this);
      this._onClick.push(onClick);
      row.addEventListener('click', onClick);

      const onDoubleClick = onDoubleClickRow(row).bind(this);
      this._onDoubleClick.push(onDoubleClick);
      row.addEventListener('dblclick', onDoubleClick);
    });
  }

  /**
   * Destroys the functionality of the selection and resets the table
   * to its pre state.
   */
  destroy() {
    this.element.classList.remove(this.className);
    this.element.tabIndex = null;

    // remove events
    this.element.removeEventListener('keydown', this._onKeyDown);
    this.element.removeEventListener('focusout', this._onFocusOut);
    this.element.removeEventListener('mousedown', this._onMouseDown);

    this.rows().forEach(row => {
      this.deselectRow(row);

      this._onClick.forEach(onClick => {
        row.removeEventListener('click', onClick);
      });

      this._onDoubleClick.forEach(onDoubleClick => {
        row.removeEventListener('dblclick', onDoubleClick);
      });
    });

    // delete everything that is bound to `this`
    Object.keys(this).forEach(name => {
      delete this[name];
    });
  }

  /**
   * Returns the rows in the table.
   * @returns {Array} - Array of HTMLTableRowElements.
   */
  rows() {
    return Array.from(this.element.querySelector('tbody').children);
  }

  /**
   * Checks if the row is selected.
   * @param {HTMLTableRowElement} row
   * @returns {boolean}
   */
  isRowSelected(row) {
    if (!row) return false;
    return row.classList.contains(this.selectedClassName);
  }

  /**
   * Returns the selected rows in the table.
   * @returns {Array} - Array of HTMLTableRowElements.
   */
  selectedRows() {
    return this.rows().filter(row => this.isRowSelected(row));
  }

  /**
   * Returns the last (explicitly) selected row in the table.
   * Returns `null` if no row is (explicitly) selected.
   * @returns {HTMLTableRowElement}
   */
  lastSelectedRow() {
    return last(this._lastSelectedRows);
  }

  /**
   * Checks if the row is selectable.
   * @param {HTMLTableRowElement} row
   * @returns {boolean}
   */
  selectableRow(row) {
	// `nextSibling` or `previousSibling` can be a text object
	// dependent on your html structure => skip those
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
  nextRow(row) {
    if (!row) return null;

    let nextRow = row.nextSibling;
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
  previousRow(row) {
    if (!row) return null;

    let previousRow = row.previousSibling;
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
  indexOfRow(row) {
    return this.rows().indexOf(row);
  }

  /**
   * Select a row.
   * @param {HTMLTableRowElement} row
   * @param expand - Already selected rows get not deselected. Default: false.
   * @param saveAsLastSelected - Explicitly save this row as last selected.
   * Default: true.
   */
  selectRow(row, expand = false, saveAsLastSelected = true) {
    if (!row) return;
    if (!this.shouldSelectRow(row)) return;

    if (!expand) {
      // deselect all rows except `row`
      this.selectedRows()
        .filter(r => r !== row)
        .forEach(r => this.deselectRow(r));
    }

    // deselect all rows except `row`
    const index = this._lastSelectedRows.indexOf(row);
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
  deselectRow(row) {
    if (!row) return;
    if (!this.shouldSelectRow(row)) return;

    // deselect all rows except `row`
    const index = this._lastSelectedRows.indexOf(row);
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
  toggleRow(row, expand = false, saveAsLastSelected = true) {
    if (!this.isRowSelected(row)) {
      this.selectRow(row, expand, saveAsLastSelected);
    } else {
      this.deselectRow(row);
    }
  }

  /**
   * Select all rows.
   */
  selectAll() {
    this.rows().forEach(row => this.selectRow(row, true, false));
  }

  /**
   * Deselects all rows.
   */
  deselectAll() {
    this.rows().forEach(row => this.deselectRow(row));
  }

  /**
   * Selects a range of rows from the last selected row to `row`.
   * @param {HTMLTableRowElement} row
   * @param expand - Already selected rows get not deselected. Default: false.
   */
  selectRange(row, expand = false) {
    const rows = this.rows();
    const lastSelectedRow = this.lastSelectedRow();
    const rowIndex = this.indexOfRow(row);
    let lastSelectedRowIndex = this.indexOfRow(lastSelectedRow);
    if (lastSelectedRowIndex < 0) lastSelectedRowIndex = 0;

    let index1 = Math.min(rowIndex, lastSelectedRowIndex);  // min
    let index2 = Math.max(rowIndex, lastSelectedRowIndex);  // max

    if (!expand) {
      // deselect all rows except the rows in the range [index1, index2]
      [...rows.slice(0, index1), ...rows.slice(index2 + 1, rows.length)]
        .forEach(r => this.deselectRow(r));
    }

    // dont repeat selecting `lastSelectedRow`, thus shift the indices
    // if necessary
    if (lastSelectedRowIndex < rowIndex) {
      if (lastSelectedRow) index1++;
      index2++;
    }

    rows.slice(index1, index2).forEach(r => {
      this.selectRow(r, true, false);
    });
  }

  /**
   * Triggers the action event on all selected rows.
   */
  action() {
    if (this.selectedRows().length > 0) {
      dispatch.action(this.element, this.selectedRows());
    }
  }
}

/**
 * Overrides the default options.
 * @param {object} options
 */
export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.TableSelect = TableSelect;
