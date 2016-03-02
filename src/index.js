'use strict';

import CustomEvent from 'custom-event';
import { remove, last } from 'lodash';

import { onBeforeSelect, onBeforeDeselect } from './events/select';
import { onKeyPress } from './events/keypress';
import { onFocusOut } from './events/focus';
import { onClickRow } from './events/click';

/*
 shift und strg, arrow and normal click
 action
 lodash nur arrow remove und last
 */

const defaultOptions = {
  className: 'selectable',
  selectedClassName: 'selected',
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
    this._lastSelectedRows = [];

    this._onBeforeSelect = onBeforeSelect.bind(this);
    this._onBeforeDeselect = onBeforeDeselect.bind(this);
    this._onKeyPress = onKeyPress.bind(this);
    this._onFocusOut = onFocusOut.bind(this);

    this.element.addEventListener('beforeSelect', this._onBeforeSelect);
    this.element.addEventListener('beforeDeselect', this._onBeforeDeselect);
    this.element.addEventListener('keydown', this._onKeyPress);
    this.element.addEventListener('focusout', this._onFocusOut);

    this.rows().forEach(row => {
      row.addEventListener('click', onClickRow(row).bind(this));
    });
  }

  destroy() {
    this.element.classList.remove(this.className);

    this.element.removeEventListener('beforeSelect', this._onBeforeSelect);
    this.element.removeEventListener('beforeDeselect', this._onBeforeDeselect);
    this.element.removeEventListener('keydown', this._onKeyPress);
    this.element.removeEventListener('focusout', this._onFocusOut);

    this.rows().forEach(row => {
      this.deselectRow(row);
      row.removeEventListener('click');
    });

    Object.keys(this).forEach(name => {
      this[name] = null;
    });
  }

  rows() {
    return Array.from(this.element.querySelector('tbody').children);
  }

  indexOfRow(row) {
    return this.rows().indexOf(row);
  }

  isRowSelected(row) {
    return row.classList.contains(this.selectedClassName);
  }

  selectedRows() {
    return this.rows().filter(row => this.isRowSelected(row));
  }

  selectedRowIndices() {
    return this.selectedRows().map(row => this.indexOfRow(row));
  }

  nextRow(row) {
    let nextRow = row.nextSibling;
    while (nextRow !== null && nextRow.nodeType === 3) {
      nextRow = nextRow.nextSibling;
    }
    return nextRow;
  }

  previousRow(row) {
    let previousRow = row.previousSibling;
    while (previousRow !== null && previousRow.nodeType === 3) {
      previousRow = previousRow.previousSibling;
    }
    return previousRow;
  }

  selectRow(row, expand = false, explicitSelected = false) {
    function deselectAllOthers() {
      this.selectedRows()
        .filter(r => r !== row)
        .forEach(r => this.deselectRow(r));
    }

    if (!expand) {
      const boundDeselectAllOthers = deselectAllOthers.bind(this);
      this.element.addEventListener('afterSelect', boundDeselectAllOthers);
      setTimeout(() => {
        this.element.removeEventListener('afterSelect', boundDeselectAllOthers);
      }, 100);
    }

    if (!this.isRowSelected(row)) {
      this.element.dispatchEvent(new CustomEvent('beforeSelect', {
        cancelable: true,
        detail: {
          row,
          explicitSelected,
          index: this.indexOfRow(row),
        },
      }));
    }
  }

  deselectRow(row) {
    if (this.isRowSelected(row)) {
      this.element.dispatchEvent(new CustomEvent('beforeDeselect', {
        cancelable: true,
        detail: {
          row,
          index: this.indexOfRow(row),
        },
      }));
    }
  }

  selectAll() {
    this.rows().forEach(row => this.selectRow(row, true));
  }

  deselectAll() {
    this.rows().forEach(row => this.deselectRow(row));
  }

  selectRange(row, expand = false) {
    // console.log(this._lastSelectedRows);

    const rowIndex = this.indexOfRow(row);
    const otherRow = last(this._lastSelectedRows);
    const otherRowIndex = otherRow ? this.indexOfRow(otherRow) : 0;

    const firstRow = rowIndex < otherRowIndex ? row : otherRow;
    const diff = Math.abs(rowIndex - otherRowIndex);

    let currentRow = this.nextRow(firstRow);
    for (var i = 0; i < diff; i++) {
      //console.log(currentRow);
      this.selectRow(currentRow, true, false);
      currentRow = this.nextRow(currentRow);
    }
    this.rows().forEach(r => {
      //this.selectRow(r, true, false);
    });
  }
}

export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}

if (window) window.TableSelect = TableSelect;
