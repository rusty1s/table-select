'use strict';

import { head, last } from 'lodash/array';

/**
 * The arrow up behaviour.
 * @param event
 */
function arrowUp(event) {
  if (!event.shiftKey || !this.lastSelectedRow()) {
    // `row` is the next row to be selected
    // => last row in the table or the previous row of the last selected row
    let row = last(this.rows());
    if (this.lastSelectedRow()) row = this.previousRow(this.lastSelectedRow());

    while (row && this.isRowSelected(row)) {
      row = this.previousRow(row);
    }

    this.selectRow(row || head(this.rows()), false, true);
  } else {
    // shift arrow up
    const row = this.lastSelectedRow();

    // check if there exists a selected range event to next rows
    // => arrow up performs a deselecting at the bottom of the range
    let nextRow = this.nextRow(row);
    while (nextRow && this.isRowSelected(nextRow)) {
      nextRow = this.nextRow(nextRow);
    }

    const index = this.rows().length - 1;
    if (nextRow && row !== this.previousRow(nextRow)) {
      this.deselectRow(this.previousRow(nextRow));
      return;
    } else if (!nextRow && this.indexOfRow(this.lastSelectedRow()) !== index) {
      this.deselectRow(last(this.rows()));
      return;
    }

    // otherwise: run up the selection to top and find the row
    // that is about to get selected
    let previousRow = this.previousRow(row);
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
  if (!event.shiftKey || !this.lastSelectedRow()) {
    // `row` is the next row to be selected
    // => first row in the table or the next row of the last selected row
    let row = head(this.rows());
    if (this.lastSelectedRow()) row = this.nextRow(this.lastSelectedRow());

    while (row && this.isRowSelected(row)) {
      row = this.nextRow(row);
    }

    this.selectRow(row || last(this.rows()), false, true);
  } else {
    // shift arrow down
    const row = this.lastSelectedRow();

    // check if there exists a selected range event to previous rows
    // => arrow down performs a deselecting at the top of the range
    let previousRow = this.previousRow(row);
    while (previousRow && this.isRowSelected(previousRow)) {
      previousRow = this.previousRow(previousRow);
    }

    if (previousRow && row !== this.nextRow(previousRow)) {
      this.deselectRow(this.nextRow(previousRow));
      return;
    } else if (!previousRow && this.indexOfRow(this.lastSelectedRow()) !== 0) {
      this.deselectRow(head(this.rows()));
      return;
    }

    // otherwise: run down the selection to bottom and find the row
    // that is about to get selected
    let nextRow = this.nextRow(row);
    while (nextRow && this.isRowSelected(nextRow)) {
      nextRow = this.nextRow(nextRow);
    }

    this.selectRow(nextRow, true, false);
  }
}

/**
 * The key down table behaviour (arrow up, arrow down and enter).
 */
export function onKeyDown(event) {
  if (event.which === 38 || event.keyCode === 38) {
    arrowUp.call(this, event);  // arrow up
  } else if (event.which === 40 || event.keyCode === 40) {
    arrowDown.call(this, event); // arrow down
  } else if (event.which === 13 || event.keyCode === 13) {
    this.action(); // enter
  }
}
