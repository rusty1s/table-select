'use strict';

import { test } from 'tape';
import TableSelect from '../../src';

test('selecting rows by click', t => {
  const table = document.querySelector('table');
  const rows = Array.from(document.querySelectorAll('tr'));
  const tableSelect = new TableSelect(table);

  rows[0].click();

  rows.forEach((row, index) => {
    if (index === 0) t.equal(row.className, 'selected');
    else t.equal(row.className, '');
  });

  rows[1].click();
  rows.forEach((row, index) => {
    if (index === 1) t.equal(row.className, 'selected');
    else t.equal(row.className, '');
  });

  tableSelect.destroy();
  t.end();
});

test('selecting multiple rows by click', t => {
  t.end();
});

test('selecting rows by function', t => {
  t.end();
});

test('selecting rows by keys', t => {
  t.end();
});
