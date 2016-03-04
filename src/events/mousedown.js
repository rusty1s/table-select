'use strict';

function clearSelection() {
  const selection = window.getSelection ?
    window.getSelection() :
    document.selection;

  if (selection) {
    if (selection.removeAllRanges) selection.removeAllRanges();
    else if (selection.empty) selection.empty();
  }
}

export function onMouseDown(event) {
  if (event.shiftKey) {
    clearSelection();
  }
}
