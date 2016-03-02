/*
 function clearSelection() {
 const selection = window.getSelection ?
 window.getSelection() :
 document.selection;
 if (selection) {
 if (selection.removeAllRanges) sel.removeAllRanges();
 else if (selection.empty) sel.empty();
 }
 }*/

'use strict';

export function onClickRow(row) {
  return function onClick(event) {
    if (event.shiftKey) {
      this.selectRange(row, true);
    } else if (event.ctrlKey || event.metaKey) {
      if (!this.isRowSelected(row)) {
        this.selectRow(row, false, true);
        this._lastSelectedRows.push(row);
      } else {
        this.deselectRow(row);
        remove(this._lastSelectedRows, r => r === row);
      }
    } else {
      this.selectRow(row, false, true);
      this._lastSelectedRows = [row];
    }
  };
}