'use strict';

import { test } from 'tape';
import TableSelect from '../../src';

let rows = null;
let table = null;
let tableSelect = null;

test('pre methods', t => {
  rows = Array.from(document.querySelectorAll('tr'));
  table = document.querySelector('table');
  tableSelect = new TableSelect(table);

  t.end();
});

test('next row', t => {
  t.notOk(tableSelect.nextRow(null));
  t.equal(tableSelect.nextRow(rows[0]), rows[1]);
  t.notOk(tableSelect.nextRow(rows[4]));

  t.end();
});

test('previous row', t => {
  t.notOk(tableSelect.previousRow(null));
  t.equal(tableSelect.previousRow(rows[4]), rows[3]);
  t.notOk(tableSelect.previousRow(rows[0]));

  t.end();
});

test('select row', t => {
  tableSelect.deselectAll();

  tableSelect.selectRow(rows[0]);
  t.ok(tableSelect.isRowSelected(rows[0]));
  t.equal(tableSelect.selectedRows().length, 1);
  t.equal(tableSelect.lastSelectedRow(), rows[0]);
  t.equal(tableSelect._lastSelectedRows.length, 1);

  tableSelect.selectRow(rows[1], false, false);
  t.ok(tableSelect.isRowSelected(rows[1]));
  t.equal(tableSelect.selectedRows().length, 1);
  t.notOk(tableSelect.lastSelectedRow());
  t.equal(tableSelect._lastSelectedRows.length, 0);

  tableSelect.selectRow(rows[2], true);
  t.ok(tableSelect.isRowSelected(rows[2]));
  t.equal(tableSelect.selectedRows().length, 2);
  t.equal(tableSelect.lastSelectedRow(), rows[2]);
  t.equal(tableSelect._lastSelectedRows.length, 1);

  tableSelect.selectRow(rows[3], true, false);
  t.ok(tableSelect.isRowSelected(rows[3]));
  t.equal(tableSelect.selectedRows().length, 3);
  t.equal(tableSelect.lastSelectedRow(), rows[2]);
  t.equal(tableSelect._lastSelectedRows.length, 1);

  t.end();
});

test('deselect row', t => {
  tableSelect.deselectAll();

  tableSelect.selectRow(rows[0], true);
  tableSelect.selectRow(rows[1], true);

  tableSelect.deselectRow(rows[0]);
  t.notOk(tableSelect.isRowSelected(rows[0]));
  t.equal(tableSelect.selectedRows().length, 1);
  t.equal(tableSelect.lastSelectedRow(), rows[1]);
  t.equal(tableSelect._lastSelectedRows.length, 1);

  t.end();
});

test('select range', t => {
  tableSelect.deselectAll();

  tableSelect.selectRow(rows[2], true);
  tableSelect.selectRow(rows[4], true);

  tableSelect.selectRange(rows[1], true);
  t.ok(tableSelect.isRowSelected(rows[1]));
  t.equal(tableSelect.selectedRows().length, 4);
  t.equal(tableSelect.lastSelectedRow(), rows[4]);
  t.equal(tableSelect._lastSelectedRows.length, 1);

  t.end();
});

test('post methods', t => {
  tableSelect.destroy();
  t.end();
});
