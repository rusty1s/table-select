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

export function action(element, rows) {
  element.dispatchEvent(
    new CustomEvent('action', rowDetails(rows))
  );
}

export function beforeSelect(element, row) {
  element.dispatchEvent(
    new CustomEvent('beforeSelect', rowDetail(row))
  );
}

export function afterSelect(element, row) {
  element.dispatchEvent(
    new CustomEvent('afterSelect', rowDetail(row))
  );
}

export function beforeDeselect(element, row) {
  element.dispatchEvent(
    new CustomEvent('beforeDeselect', rowDetail(row))
  );
}

export function afterDeselect(element, row) {
  element.dispatchEvent(
    new CustomEvent('afterDeselect', rowDetail(row))
  );
}
