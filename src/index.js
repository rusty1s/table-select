'use strict';

import CustomEvent from 'custom-event';
import { remove, head, last } from 'lodash';

import { onKeyDown } from './events/keydown';
import { onFocusOut } from './events/focus';
import { onMouseDown } from './events/mousedown';
import { onClickRow } from './events/click';
import { onDblClickRow } from './events/dblclick';

/*
arrow + action
lodash nur arrow remove und last
 */

const defaultOptions = {
  className: 'selectable',
  selectedClassName: 'selected',
  tabIndex: 1,
  shouldSelectRow() { return true; },
  shouldDeselectRow() { return true; },
};

export default class TableSelect {
  constructor(element, options = {}) {
    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    if (!element.querySelector('tbody')) {
      throw new Error('Element must contain a \'tbody\' element');
    }

    Object.assign(this, defaultOptions, options, { element });

    this._init();
  }

  _init() {
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

  rows() {
    return Array.from(this.element.querySelector('tbody').children);
  }

  isRowSelected(row) {
    if (!row) return false;

    return row.classList.contains(this.selectedClassName);
  }

  selectedRows() {
    return this.rows().filter(row => this.isRowSelected(row));
  }

  lastSelectedRow() {
    return last(this._lastSelectedRows);
  }

  nextRow(row) {
    if (!row) return null;

    let nextRow = row.nextSibling;
    while (nextRow !== null && (nextRow.nodeType === 3 || !this.shouldSelectRow(nextRow))) {
      nextRow = nextRow.nextSibling;
    }
    return nextRow;
  }

  previousRow(row) {
    if (!row) return null;

    let previousRow = row.previousSibling;
    while (previousRow !== null && (previousRow.nodeType === 3 || !this.shouldSelectRow(previousRow))) {
      previousRow = previousRow.previousSibling;
    }
    return previousRow;
  }

  indexOfRow(row) {
    return this.rows().indexOf(row);
  }

  _rowDetail(row) {
    return {
      detail: {
        row,
      }
    };
  }

  _selectedRowDetails() {
    return {
      detail: {
        rows: this.selectedRows(),
      }
    };
  }

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
      this.element.dispatchEvent(new CustomEvent('beforeSelect', this._rowDetail(row)));
      row.classList.add(this.selectedClassName);
      this.element.dispatchEvent(new CustomEvent('afterSelect', this._rowDetail(row)));
    }

    return true;
  }

  deselectRow(row) {
    if (!row) return false;
    if (!this.shouldSelectRow(row)) return false;

    remove(this._lastSelectedRows, r => r === row);

    if (this.isRowSelected(row)) {
      this.element.dispatchEvent(new CustomEvent('beforeDeselect', this._rowDetail(row)));
      row.classList.remove(this.selectedClassName);
      this.element.dispatchEvent(new CustomEvent('afterDeselect', this._rowDetail(row)));
    }
  }

  toggleRow(row, expand = false, saveAsLastSelected = true) {
    if (!this.isRowSelected(row)) this.selectRow(row, expand, saveAsLastSelected);
    else this.deselectRow(row);
  }

  selectAll() {
    this._lastSelectedRows = [];
    this.rows().forEach(row => this.selectRow(row, true, false));
  }

  deselectAll() {
    this.rows().forEach(row => this.deselectRow(row));
  }

  selectRange(row, expand = false) {
    const rows = this.rows();
    const lastSelectedRow = this.lastSelectedRow();
    const rowIndex = this.indexOfRow(row);
    const lastSelectedRowIndex = lastSelectedRow ? this.indexOfRow(lastSelectedRow) : 0;
    let index1 = Math.min(rowIndex, lastSelectedRowIndex);
    let index2 = Math.max(rowIndex, lastSelectedRowIndex);

    if (!expand) {
     [...rows.slice(0, index1), ...rows.slice(index2+1, rows.length)]
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

  action() {
    if (this.selectedRows().length > 0 ) {
      this.element.dispatchEvent(new CustomEvent('action', this._selectedRowDetails()));
    }
  }
}

export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.TableSelect = TableSelect;
