'use strict';

import { test } from 'tape';
import TableSelect from '../../../src';
import KeyCodeEvent from '../../helper/key-code-event';

let rows = null;
let table = null;
let tableSelect = null;

test('pre keydown', t => {
  rows = Array.from(document.querySelectorAll('tr'));
  table = document.querySelector('table');
  tableSelect = new TableSelect(table);

  t.end();
});

test('arrow down row', t => {
  table.focus();

  table.dispatchEvent(new KeyCodeEvent('keydown', 40));
  t.equal(tableSelect.lastSelectedRow(), rows[0]);
  t.equal(tableSelect.selectedRows().length, 1);

  table.dispatchEvent(new KeyCodeEvent('keydown', 40));
  t.equal(tableSelect.lastSelectedRow(), rows[1]);
  t.equal(tableSelect.selectedRows().length, 1);

  tableSelect.deselectAll();
  t.end();
});

test('arrow up row', t => {
  table.focus();

  table.dispatchEvent(new KeyCodeEvent('keydown', 38));
  t.equal(tableSelect.lastSelectedRow(), rows[4]);
  t.equal(tableSelect.selectedRows().length, 1);

  table.dispatchEvent(new KeyCodeEvent('keydown', 38));
  t.equal(tableSelect.lastSelectedRow(), rows[3]);
  t.equal(tableSelect.selectedRows().length, 1);

  tableSelect.deselectAll();
  t.end();
});

test('shift arrow up and down', t => {
  table.focus();

  rows[2].click();
  table.dispatchEvent(new KeyCodeEvent('keydown', 40, { shiftKey: true }));
  table.dispatchEvent(new KeyCodeEvent('keydown', 40, { shiftKey: true }));

  t.equal(tableSelect.lastSelectedRow(), rows[2]);
  t.equal(tableSelect.selectedRows().length, 3);
  t.ok(tableSelect.isRowSelected(rows[4]));

  table.dispatchEvent(new KeyCodeEvent('keydown', 38, { shiftKey: true }));
  table.dispatchEvent(new KeyCodeEvent('keydown', 38, { shiftKey: true }));
  table.dispatchEvent(new KeyCodeEvent('keydown', 38, { shiftKey: true }));

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
