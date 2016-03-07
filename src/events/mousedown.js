'use strict';

import clearSelection from '../helper/clear-selection';

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
