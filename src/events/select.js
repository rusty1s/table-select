'use strict';

export function onBeforeSelect(event) {
  setTimeout(() => {
    if (!event.defaultPrevented) {
      event.detail.row.classList.add(this.selectedClassName);

      this.element.dispatchEvent(new CustomEvent('afterSelect', {
        detail: event.detail,
      }));
    }
  });
}

export function onBeforeDeselect(event) {
  setTimeout(() => {
    if (!event.defaultPrevented) {
      event.detail.row.classList.remove(this.selectedClassName);

      this.element.dispatchEvent(new CustomEvent('afterDeselect', {
        detail: event.detail,
      }));
    }
  });
}