'use strict';

/**
 * Clears the selection in the document.
 */
function clearSelection() {
  const selection = window.getSelection ?
    window.getSelection() :
    document.selection;

  if (selection) {
    if (selection.removeAllRanges) selection.removeAllRanges();
    else if (selection.empty) selection.empty();
  }
}

/**
 * Clears the selection in the document on mouse down
 * when the shift key is pressed.
 * @param event
 */
export function onMouseDown(event) {
  if (event.shiftKey) {
    clearSelection();
  }
}
