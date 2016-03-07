'use strict';

import { test } from 'tape';
import TableSelect from '../../src';
import { setDefaultOptions } from '../../src';

test('init', t => {
  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table);

  t.ok(tableSelect);
  t.equal(table.className, 'selectable');
  t.equal(tableSelect.selectedRows().length, 0);

  tableSelect.destroy();
  t.end();
});

test('failed init', t => {
  t.plan(1);

  const row = document.querySelector('tr');
  try {
    const tableSelect = new TableSelect(row);
    t.ok(tableSelect);
  } catch (error) {
    t.equal(error.message, 'Element must be a table');
  }
});


test('init with options', t => {
  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table, {
    className: 'test',
  });

  t.equal(table.className, 'test');

  tableSelect.destroy();
  t.end();
});

test('setting default options', t => {
  setDefaultOptions({
    className: 'test',
  });

  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table);

  t.equal(table.className, 'test');

  tableSelect.destroy();
  t.end();
});

test('destroy', t => {
  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table);
  tableSelect.destroy();

  t.equal(table.className, '');
  t.equal(Object.keys(tableSelect).length, 0);

  t.end();
});
