'use strict';

/**
 * Returns the double click behaviour for a row.
 * @param {HTMLTableRowElement} row
 * @returns {Function}
 */
export function onDoubleClickRow(row) {
  return function onDoubleClick(event) {
    if (!this.shouldSelectRow(row)) return;

    if (event.ctrlKey || event.metaKey) {
      this.selectRow(row, true, true);
    }

    this.action();
  };
}
