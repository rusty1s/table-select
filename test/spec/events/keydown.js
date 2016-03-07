'use strict';

import { test } from 'tape';
import TableSelect from '../../../src';

let rows = null;
let table = null;
let tableSelect = null;

const arrowDown = new KeyboardEvent('keydown');
Object.defineProperty(arrowDown, 'keyCode', {
  get() { return this.keyCodeVal; },
});
arrowDown.keyCodeVal = 40;

const shiftArrowDown = new KeyboardEvent('keydown', { shiftKey: true });
Object.defineProperty(shiftArrowDown, 'keyCode', {
  get() { return this.keyCodeVal; },
});
shiftArrowDown.keyCodeVal = 40;

const arrowUp = new KeyboardEvent('keydown');
Object.defineProperty(arrowUp, 'keyCode', {
  get() { return this.keyCodeVal; },
});
arrowUp.keyCodeVal = 38;

const shiftArrowUp = new KeyboardEvent('keydown', { shiftKey: true });
Object.defineProperty(shiftArrowUp, 'keyCode', {
  get() { return this.keyCodeVal; },
});
shiftArrowUp.keyCodeVal = 38;

test('pre keydown', t => {
  rows = Array.from(document.querySelectorAll('tr'));
  table = document.querySelector('table');
  tableSelect = new TableSelect(table);

  t.end();
});

test('arrow down row', t => {
  table.focus();

  table.dispatchEvent(arrowDown);
  t.equal(tableSelect.lastSelectedRow(), rows[0]);
  t.equal(tableSelect.selectedRows().length, 1);

  table.dispatchEvent(arrowDown);
  t.equal(tableSelect.lastSelectedRow(), rows[1]);
  t.equal(tableSelect.selectedRows().length, 1);

  tableSelect.deselectAll();
  t.end();
});

test('arrow up row', t => {
  table.focus();

  table.dispatchEvent(arrowUp);
  t.equal(tableSelect.lastSelectedRow(), rows[4]);
  t.equal(tableSelect.selectedRows().length, 1);

  table.dispatchEvent(arrowUp);
  t.equal(tableSelect.lastSelectedRow(), rows[3]);
  t.equal(tableSelect.selectedRows().length, 1);

  tableSelect.deselectAll();
  t.end();
});

test('shift arrow up and down', t => {
  table.focus();

  rows[2].click();
  table.dispatchEvent(shiftArrowDown);
  table.dispatchEvent(shiftArrowDown);

  t.equal(tableSelect.lastSelectedRow(), rows[2]);
  t.equal(tableSelect.selectedRows().length, 3);
  t.ok(tableSelect.isRowSelected(rows[4]));

  table.dispatchEvent(shiftArrowUp);
  table.dispatchEvent(shiftArrowUp);
  table.dispatchEvent(shiftArrowUp);

  t.equal(tableSelect.lastSelectedRow(), rows[2]);
  t.equal(tableSelect.selectedRows().length, 2);
  t.ok(tableSelect.isRowSelected(rows[1]));

  tableSelect.deselectAll();
  t.end();
});

test('post keydown', t => {
  tableSelect.destroy();
  t.end();
});
