'use strict';

/**
 * Returns the click behaviour for a row.
 * @param {HTMLTableRowElement} row
 * @returns {Function}
 */
export function onClickRow(row) {
  return function onClick(event) {
    if (event.shiftKey) {
      this.selectRange(row, event.ctrlKey || event.metaKey);
    } else {
      if (event.ctrlKey || event.metaKey) this.toggleRow(row, true, true);
      else this.selectRow(row, false, true);
    }
  };
}
