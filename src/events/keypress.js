'use strict';

export function onKeyPress(event) {
  // up arrow
  if (event.keyCode === 38) {
    let previousRow = this.selectedRows().shift().previousSibling;
    while (previousRow !== null && previousRow.nodeType === 3) {
      previousRow = previousRow.previousSibling;
    }

    if (previousRow) this.selectRow(previousRow, false, true);
  }

  // down arrow
  if (event.keyCode === 40) {
    let nextRow = this.selectedRows().pop().nextSibling;
    while (nextRow !== null && nextRow.nodeType === 3) {
      nextRow = nextRow.nextSibling;
    }

    if (nextRow) this.selectRow(nextRow, false, true);
  }
}
