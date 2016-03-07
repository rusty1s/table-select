'use strict';

import { test } from 'tape';
import TableSelect from '../../../src';

let rows = null;
let table = null;
let tableSelect = null;

test('pre click', t => {
  rows = Array.from(document.querySelectorAll('tr'));
  table = document.querySelector('table');
  tableSelect = new TableSelect(table);

  t.end();
});

test('click row', t => {
  rows[0].click();
  t.equal(tableSelect.lastSelectedRow(), rows[0]);
  t.equal(tableSelect.selectedRows().length, 1);

  rows[1].click();
  t.equal(tableSelect.lastSelectedRow(), rows[1]);
  t.equal(tableSelect.selectedRows().length, 1);

  tableSelect.deselectAll();
  t.end();
});

test('control click row', t => {
  rows[0].click();
  t.equal(tableSelect.lastSelectedRow(), rows[0]);
  t.equal(tableSelect.selectedRows().length, 1);

  rows[1].dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
  t.equal(tableSelect.lastSelectedRow(), rows[1]);
  t.equal(tableSelect.selectedRows().length, 2);

  rows[0].dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
  t.equal(tableSelect.lastSelectedRow(), rows[1]);
  t.equal(tableSelect.selectedRows().length, 1);

  tableSelect.deselectAll();
  t.end();
});


test('shift click row', t => {
  rows[2].dispatchEvent(new MouseEvent('click', { shiftKey: true }));
  t.notOk(tableSelect.lastSelectedRow());
  t.equal(tableSelect.selectedRows().length, 3);

  rows[4].click();
  rows[2].dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
  rows[3].dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
  rows[1].dispatchEvent(new MouseEvent('click', { shiftKey: true }));
  t.equal(tableSelect.lastSelectedRow(), rows[3]);
  t.equal(tableSelect._lastSelectedRows.length, 1);
  t.equal(tableSelect.selectedRows().length, 3);

  tableSelect.deselectAll();
  t.end();
});

test('control + shift click row', t => {
  rows[4].click();
  rows[2].dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
  rows[3].dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
  rows[1].dispatchEvent(new MouseEvent('click', {
    shiftKey: true,
    ctrlKey: true,
  }));
  t.equal(tableSelect.lastSelectedRow(), rows[3]);
  t.equal(tableSelect._lastSelectedRows.length, 2);
  t.equal(tableSelect.selectedRows().length, 4);

  tableSelect.deselectAll();
  t.end();
});

test('post click', t => {
  tableSelect.destroy();
  t.end();
});
