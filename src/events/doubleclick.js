'use strict';

export function onDoubleClickRow(row) {
  return function onDoubleClick(event) {
    if (!this.shouldSelectRow(row)) return;

    if (event.ctrlKey || event.metaKey) {
      this.selectRow(row, true, true);
    }

    this.action();
  };
}
