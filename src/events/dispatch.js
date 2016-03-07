'use strict';

import CustomEvent from 'custom-event';

/**
 * Returns the details of `row` which get sent to events.
 * @param {HTMLTableRowElement} row
 * @returns {Object}
 * @private
 */
function rowDetail(row) {
  return {
    detail: {
      row,
    },
  };
}

/**
 * Returns the details of all selected rows which get sent to events.
 * @returns {Object}
 * @private
 */
function rowDetails(rows) {
  return {
    detail: {
      rows,
    },
  };
}

/**
 * Triggers the `action` event on `element` with details `rows`.
 * @param {HTMLTableElement} element
 * @param {Array} rows - Array of HTMLTableRowElements.
 */
export function action(element, rows) {
  element.dispatchEvent(
    new CustomEvent('action', rowDetails(rows))
  );
}

/**
 * Triggers the `beforeSelect` event on `element` with details `row`.
 * @param {HTMLTableElement} element
 * @param {HTMLTableRowElement} row
 */
export function beforeSelect(element, row) {
  element.dispatchEvent(
    new CustomEvent('beforeSelect', rowDetail(row))
  );
}

/**
 * Triggers the `afterSelect` event on `element` with details `row`.
 * @param {HTMLTableElement} element
 * @param {HTMLTableRowElement} row
 */
export function afterSelect(element, row) {
  element.dispatchEvent(
    new CustomEvent('afterSelect', rowDetail(row))
  );
}

/**
 * Triggers the `beforeDeselect` event on `element` with details `row`.
 * @param {HTMLTableElement} element
 * @param {HTMLTableRowElement} row
 */
export function beforeDeselect(element, row) {
  element.dispatchEvent(
    new CustomEvent('beforeDeselect', rowDetail(row))
  );
}

/**
 * Triggers the `afterDeselect` event on `element` with details `row`.
 * @param {HTMLTableElement} element
 * @param {HTMLTableRowElement} row
 */
export function afterDeselect(element, row) {
  element.dispatchEvent(
    new CustomEvent('afterDeselect', rowDetail(row))
  );
}
