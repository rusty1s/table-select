'use strict';

import { test } from 'tape';
import TableSelect from '../../src';

test('init', t => {
  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table);

  t.ok(tableSelect);
  t.equal(table.className, 'selectable');

  tableSelect.destroy();
  t.end();
});

test('init with options', t => {
  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table);

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

test('destroy', t => {
  const table = document.querySelector('table');
  const tableSelect = new TableSelect(table);
  tableSelect.destroy();

  t.equal(table.className, '');

  t.end();
});
