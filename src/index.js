'use strict';

/*
 * Custom Events
 * Test phantomJS
 * README
 */

/*
 * shouldSelectRowAtIndex(row, index)
 * willSelectRowAtIndex(row, index)
 * didSelectRowAtIndex(row, index)
 * shouldDeselectRowAtIndex(row, index)
 * willDeselectRowAtIndex(row, index)
 * didDeselectRowAtIndex(row, index)
 */
const defaultOptions = {
  shouldSelectRowAtIndex() { return true; },
  willSelectRowAtIndex() {},
  didSelectRowAtIndex() {},
  shouldDeselectRowAtIndex() { return true; },
  willDeselectRowAtIndex() {},
  didDeselectRowAtIndex() {},
};

class TableSelect {
  constructor(element, options = {}) {
    if (!element || element.tagName !== 'TABLE') {
      throw new Error('Element must be a table');
    }

    Object.assign(this, defaultOptions, options, { element });

    this.init();
  }

  init() {
    this.element.classList.add('selectable');
    this.getRows().forEach(row => this.initRow(row));
  }

  initRow(row) {
    row.addEventListener('click', () => {
      this.getSelectedRows().forEach(r => this.deselectRow(r));
      this.selectRow(row);
    });
  }

  getRows() {
    return Array.from(this.element.querySelector('tbody').children);
  }

  getIndexOfRow(row) {
    return this.getRows().indexOf(row);
  }

  isRowSelected(row) {
    return row.classList.contains('selected');
  }

  getSelectedRows() {
    return this.getRows().filter(row => this.isRowSelected(row));
  }

  selectRow(row) {
    if (!this.isRowSelected(row)) {
      const index = this.getIndexOfRow(row);
      if (this.shouldSelectRowAtIndex(row, index)) {
        this.willSelectRowAtIndex(row, index);
        row.classList.add('selected');
        this.didSelectRowAtIndex(row, index);
      }
    }
  }

  deselectRow(row) {
    if (this.isRowSelected(row)) {
      const index = this.getIndexOfRow(row);
      if (this.shouldDeselectRowAtIndex(row, index)) {
        this.willDeselectRowAtIndex(row, index);
        row.classList.remove('selected');
        this.didDeselectRowAtIndex(row, index);
      }
    }
  }
}

window.TableSelect = TableSelect;
