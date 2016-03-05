'use strict';

export function onDblClickRow(row) {
  return function onDblClick(event) {
    if (!this.shouldSelectRow(row)) return;

    if (event.ctrlKey || event.metaKey) {
      this.selectRow(row, true, true);
    }

    this.action();
  };
}
