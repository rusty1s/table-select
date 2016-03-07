'use strict';

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
