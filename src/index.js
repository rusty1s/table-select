'use strict';

import CustomEvent from 'custom-event';
import { remove, last } from 'lodash';

import { onKeyDown } from './events/keydown';
import { onFocusOut } from './events/focus';
import { onMouseDown } from './events/mousedown';
import { onClickRow } from './events/click';
import { onDblClickRow } from './events/dblclick';

/*
lodash nur arrow remove und last
return in select/deselect/toggle kann glaub ich raus
 */

/**
 *
 */
const defaultOptions = {
  className: 'selectable',
  selectedClassName: 'selected',
  tabIndex: 1,
  shouldSelectRow() { return true; },
  shouldDeselectRow() { return true; },
};

/**
 *
 */
export default class TableSelect {
  /**
   * @constructor
   * @param {HTMLTableElement} element - The table which should be selectable.
   * @param {Object} options - Specific options for this instance.
   */
  constructor(element, options = {}) {
    alert(element);
    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    if (!element.querySelector('tbody')) {
      throw new Error('Element must contain a \'tbody\' element');
    }

    Object.assign(this, defaultOptions, options, { element });

    this.element.classList.add(this.className);
    this.element.tabIndex = this.tabIndex;

    this._lastSelectedRows = [];
    this._onKeyDown = onKeyDown.bind(this);
    this._onFocusOut = onFocusOut.bind(this);
    this._onMouseDown = onMouseDown.bind(this);

    this.element.addEventListener('keydown', this._onKeyDown);
    this.element.addEventListener('focusout', this._onFocusOut);
    this.element.addEventListener('mousedown', this._onMouseDown);

    this.rows().forEach(row => {
      row.addEventListener('click', onClickRow(row).bind(this));
      row.addEventListener('dblclick', onDblClickRow(row).bind(this));
    });
  }

  /**
   * Destroys the functionality of the selection and resets the table
   * to its pre state.
   */
  destroy() {
    this.element.classList.remove(this.className);
    this.element.tabIndex = null;

    this.element.removeEventListener('keydown', this._onKeyPress);
    this.element.removeEventListener('focusout', this._onFocusOut);
    this.element.removeEventListener('mousedown', this._onMouseDown);

    this.rows().forEach(row => {
      this.deselectRow(row);
      row.removeEventListener('click');
      row.removeEventListener('dblclick');
    });

    Object.keys(this).forEach(name => {
      this[name] = null;
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
   * @param row
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
   * Returns the next row of `row` which can be selected.
   * Returns `null` if `row` is the last element in the table
   * which can be selected.
   * @param row
   * @returns {HTMLTableRowElement}
   */
  nextRow(row) {
    if (!row) return null;

    let nextRow = row.nextSibling;
    while (nextRow &&
    (nextRow.nodeType === 3 || !this.shouldSelectRow(nextRow))) {
      nextRow = nextRow.nextSibling;
    }
    return nextRow;
  }

  /**
   * Returns the previous row of `row` which can be selected.
   * Returns `null` if `row` is the first element in the table
   * which can be selected.
   * @param row
   * @returns {HTMLTableRowElement}
   */
  previousRow(row) {
    if (!row) return null;

    let previousRow = row.previousSibling;
    while (previousRow &&
    (previousRow.nodeType === 3 || !this.shouldSelectRow(previousRow))) {
      previousRow = previousRow.previousSibling;
    }
    return previousRow;
  }

  /**
   * Returns the position of the row in the table.
   * Returns `-1` if the row don't occur in the table.
   * @param row
   * @returns {number}
   */
  indexOfRow(row) {
    return this.rows().indexOf(row);
  }

  /**
   * Select a row.
   * @param row
   * @param expand - Already selected rows get not deselected. Default: false.
   * @param saveAsLastSelected - Explicitly save this row as last selected. Default: true.
   * @returns {boolean} - Returns whether the selection was successful.
   */
  selectRow(row, expand = false, saveAsLastSelected = true) {
    if (!row) return false;
    if (!this.shouldSelectRow(row)) return false;

    if (!expand) {
      this.selectedRows()
        .filter(r => r !== row)
        .forEach(r => this.deselectRow(r));

      this._lastSelectedRows = [];
    }

    remove(this._lastSelectedRows, r => r === row);
    if (saveAsLastSelected) this._lastSelectedRows.push(row);

    if (!this.isRowSelected(row)) {
      this.element
        .dispatchEvent(new CustomEvent('beforeSelect', this._rowDetail(row)));
      row.classList.add(this.selectedClassName);
      this.element
        .dispatchEvent(new CustomEvent('afterSelect', this._rowDetail(row)));
    }

    return true;
  }

  /**
   * Deselects a row.
   * @param row
   * @returns {boolean} - Returns whether the deselection was successful.
   */
  deselectRow(row) {
    if (!row) return false;
    if (!this.shouldSelectRow(row)) return false;

    remove(this._lastSelectedRows, r => r === row);

    if (this.isRowSelected(row)) {
      this.element
        .dispatchEvent(new CustomEvent('beforeDeselect', this._rowDetail(row)));
      row.classList.remove(this.selectedClassName);
      this.element
        .dispatchEvent(new CustomEvent('afterDeselect', this._rowDetail(row)));
    }

    return true;
  }

  /**
   * Toggles the selection of a row.
   * @param row
   * @param expand - Already selected rows get not deselected. Default: false.
   * @param saveAsLastSelected - Explicitly save this row as last selected. Default: true.
   * @returns {boolean} - Returns whether the toggling was successful.
   */
  toggleRow(row, expand = false, saveAsLastSelected = true) {
    if (!this.isRowSelected(row)) {
      return this.selectRow(row, expand, saveAsLastSelected);
    } else return this.deselectRow(row);
  }

  /**
   * Select all rows.
   */
  selectAll() {
    this._lastSelectedRows = [];
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
   * @param row
   * @param expand - Already selected rows get not deselected. Default: false.
   */
  selectRange(row, expand = false) {
    const rows = this.rows();
    const lastSelectedRow = this.lastSelectedRow();
    const rowIndex = this.indexOfRow(row);
    const lastSelectedRowIndex = lastSelectedRow ?
      this.indexOfRow(lastSelectedRow) :
      0;
    let index1 = Math.min(rowIndex, lastSelectedRowIndex);
    let index2 = Math.max(rowIndex, lastSelectedRowIndex);

    if (!expand) {
      [...rows.slice(0, index1), ...rows.slice(index2 + 1, rows.length)]
        .forEach(r => this.deselectRow(r));
    }

    if (lastSelectedRowIndex < rowIndex) {
      index1++;
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
      this.element
        .dispatchEvent(new CustomEvent('action', this._selectedRowDetails()));
    }
  }

  /**
   * Returns the details of `row` which get sent to events.
   * @param row
   * @returns {Object}
   * @private
   */
  _rowDetail(row) {
    return {
      detail: {
        row,
      },
    };
  }

  /**
   * Returns the details of all selected rows which get sent to events.
   * @returns {Object}
   * @private
   */
  _selectedRowDetails() {
    return {
      detail: {
        rows: this.selectedRows(),
      },
    };
  }
}

/**
 * Overrides the default options.
 * @param {object} - Options.
 */
export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.TableSelect = TableSelect;
