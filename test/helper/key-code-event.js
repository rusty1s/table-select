'use strict';

/**
 * @constructor
 * @param {string} type - The name of the event.
 * @param {number} keyCode - The key code of the event.
 * @param {Object} options - The options like the options in `KeyboardEvent`.
 * @returns {Object}
 */
export default function KeyCodeEvent(type, keyCode, options) {
  const event = new KeyboardEvent(type, options);

  Object.defineProperty(event, 'keyCode', {
    get() {
      return this.keyCodeVal;
    },
  });
  event.keyCodeVal = keyCode;

  return event;
}
