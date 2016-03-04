'use strict';

import { head } from 'lodash';

function arrowUp() {

}

function arrowDown() {
  if (event.ctrlKey || event.metaKey) {
    this.action();
    return;
  }

  let nextRow = head(this.rows());
  if (!nextRow) return;

  if (this.lastSelectedRow()) {
    nextRow = this.lastSelectedRow();
    if (this.nextRow(nextRow)) {
      nextRow = this.nextRow(nextRow);
    }
  }

  let index = this.indexOfRow(nextRow);

  while(nextRow && !this.shouldSelectRow(nextRow)) {
    nextRow = this.nextRow(nextRow);
  }

  this.selectRow(nextRow, event.shiftKey, true);
}

export function onKeyDown(event) {
  if (event.keyCode === 38) arrowUp.call(this);
  else if (event.keyCode === 40) arrowDown.call(this);
}
