'use strict';

/**
 * Clears the selection in the document.
 */
export default function clearSelection() {
  const selection = window.getSelection ?
    window.getSelection() :
    document.selection;

  if (selection) {
    if (selection.removeAllRanges) selection.removeAllRanges();
    else if (selection.empty) selection.empty();
  }
}
