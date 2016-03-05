'use strict';

import { last, head } from 'lodash';

function arrowUp(event) {
  if (!event.shiftKey || !this.lastSelectedRow()) {
    let row = last(this.rows());
    if (this.lastSelectedRow()) row = this.previousRow(this.lastSelectedRow());

    while (row && this.isRowSelected(row)) {
      row = this.previousRow(row);
    }

    this.selectRow(row || head(this.rows()), false, true);
  } else {
    const row = this.lastSelectedRow();

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

    let previousRow = this.previousRow(row);
    while (previousRow && this.isRowSelected(previousRow)) {
      previousRow = this.previousRow(previousRow);
    }

    this.selectRow(previousRow, true, false);
  }
}

function arrowDown(event) {
  if (event.ctrlKey || event.metaKey) {
    this.action();
    return;
  }

  if (!event.shiftKey || !this.lastSelectedRow()) {
    let row = head(this.rows());
    if (this.lastSelectedRow()) row = this.nextRow(this.lastSelectedRow());

    while (row && this.isRowSelected(row)) {
      row = this.nextRow(row);
    }

    this.selectRow(row || last(this.rows()), false, true);
  } else {
    const row = this.lastSelectedRow();

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

    let nextRow = this.nextRow(row);
    while (nextRow && this.isRowSelected(nextRow)) {
      nextRow = this.nextRow(nextRow);
    }

    this.selectRow(nextRow, true, false);
  }
}

export function onKeyDown(event) {
  if (event.keyCode === 38) arrowUp.call(this, event);
  else if (event.keyCode === 40) arrowDown.call(this, event);
  else if (event.keyCode === 13) this.action(); // enter
}
