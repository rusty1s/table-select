'use strict';

import CustomEvent from 'custom-event';

const defaultOptions = {
  className: 'selectable',
  selectedClassName: 'selected',
};

/*
function clearSelection() {
  const selection = window.getSelection ?
    window.getSelection() :
    document.selection;
  if (selection) {
    if (selection.removeAllRanges) sel.removeAllRanges();
    else if (selection.empty) sel.empty();
  }
}*/

/*
export function setDefaultOptions(options) {
  Object.assign(defaultOptions, options);
}*/

class TableSelect {
  constructor(element, options = {}) {
    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    if (!element.querySelector('tbody')) {
      throw new Error('Element must contain a \'tbody\' element');
    }

    Object.assign(this, defaultOptions, options, { element });

    this.init();
  }

  init() {
    this.element.classList.add(this.className);
    this.rows().forEach(row => this._initRow(row));

    this.element.addEventListener('beforeSelect', event => {
      setTimeout(() => {
        if (!event.defaultPrevented) {
          event.detail.row.classList.add(this.selectedClassName);

          this.element.dispatchEvent(new CustomEvent('afterSelect', {
            detail: event.detail,
          }));
        }
      });
    });

    this.element.addEventListener('beforeDeselect', event => {
      setTimeout(() => {
        if (!event.defaultPrevented) {
          event.detail.row.classList.remove(this.selectedClassName);

          this.element.dispatchEvent(new CustomEvent('afterDeselect', {
            detail: event.detail,
          }));
        }
      });
    });
  }

  _initRow(row) {
    row.addEventListener('click', event => {
      if (event.shiftKey) {

      }
      else if (event.ctrlKey || event.metaKey) {
        this.toggleRow(row);
      }
      else {
        this.selectRowExclusive(row);
      }
    });
  }

  destroy() {
    this.element.classList.remove(this.className);
    this.rows().forEach(row => this._destroyRow(row));

    this.element.removeEventListener('beforeSelect');
    this.element.removeEventListener('beforeDeselect');
  }

  _destroyRow(row) {
    this.deselectRow(row);
    row.removeEventListener('click');
  }

  rows() {
    return Array.from(this.element.querySelector('tbody').children);
  }

  length() {
    return this.rows().length;
  }

  indexOfRow(row) {
    return this.rows().indexOf(row);
  }

  isRowSelected(row) {
    return row.classList.contains(this.selectedClassName);
  }

  selectedRows() {
    return this.rows().filter(row => this.isRowSelected(row));
  }

  selectedRowIndices() {
    return this.selectedRows().map(row => this.indexOfRow(row));
  }

  selectRow(row) {
    if (!this.isRowSelected(row)) {
      this.element.dispatchEvent(new CustomEvent('beforeSelect', {
        cancelable: true,
        detail: {
          row,
          index: this.indexOfRow(row),
        },
      }));
    }
  }

  deselectRow(row) {
    if (this.isRowSelected(row)) {
      this.element.dispatchEvent(new CustomEvent('beforeDeselect', {
        cancelable: true,
        detail: {
          row,
          index: this.indexOfRow(row),
        },
      }));
    }
  }

  toggleRow(row) {
    if (!this.isRowSelected(row)) this.selectRow(row);
    else this.deselectRow(row);
  }

  selectRowExclusive(row) {
    function deselectAllOthers() {
      this.selectedRows()
        .filter(r => r !== row)
        .forEach(r => this.deselectRow(r));
    }
    const bindedDeselectAllOthers = deselectAllOthers.bind(this);

    this.element.addEventListener('afterSelect', bindedDeselectAllOthers);
    this.selectRow(row);
    setTimeout(() => {
      this.element.removeEventListener('afterSelect', bindedDeselectAllOthers);
    });
  }

  selectAll() {
    this.rows().forEach(row => this.selectRow(row, true));
  }

  deselectAll() {
    this.rows().forEach(row => this.deselectRow(row));
  }

  selectRangeFromLastSelectedToRow(row, expand = false) {
    if (!this.lastSelectedRow) this.selectRow(row, expand);
  }
}

window.TableSelect = TableSelect;
// export default TableSelect;

/*
Todo export and window
shift und strg, arrow and normal click
event listener löschen bei destroy
 */
