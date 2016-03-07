'use strict';

import { test } from 'tape';
import TableSelect from '../../../src';
import KeyCodeEvent from '../../helper/key-code-event';

let rows = null;
let table = null;
let tableSelect = null;

test('pre dispatch', t => {
  rows = Array.from(document.querySelectorAll('tr'));
  table = document.querySelector('table');
  tableSelect = new TableSelect(table);

  t.end();
});

test('before and after select event', t => {
  function select(event) {
    t.equal(event.detail.row, rows[0]);
  }

  t.plan(3);

  table.addEventListener('beforeSelect', select);
  table.addEventListener('afterSelect', select);

  tableSelect.selectRow(rows[0]);

  setTimeout(() => {
    table.removeEventListener('beforeSelect', select);
    table.removeEventListener('afterSelect', select);
    t.ok(true);
  });
});

test('before and after deselect event', t => {
  function deselect(event) {
    t.equal(event.detail.row, rows[0]);
  }

  t.plan(3);

  table.addEventListener('beforeDeselect', deselect);
  table.addEventListener('afterDeselect', deselect);

  tableSelect.deselectRow(rows[0]);

  setTimeout(() => {
    table.removeEventListener('beforeDeselect', deselect);
    table.removeEventListener('afterDeselect', deselect);
    t.ok(true);
  });
});

test('action', t => {
  function action(event) {
    t.equal(event.detail.rows.length, 1);
  }

  t.plan(2);

  table.addEventListener('action', action);

  tableSelect.selectRow(rows[0]);
  tableSelect.action();
  tableSelect.deselectRow(rows[0]);

  setTimeout(() => {
    table.removeEventListener('action', action);
    t.ok(true);
  });
});

test('action on double click', t => {
  function action(event) {
    t.equal(event.detail.rows.length, 1);
  }

  t.plan(2);

  table.addEventListener('action', action);

  tableSelect.selectRow(rows[1]);
  rows[1].dispatchEvent(new MouseEvent('dblclick'));

  setTimeout(() => {
    table.removeEventListener('action', action);
    tableSelect.deselectAll();
    t.ok(true);
  });
});

test('action on enter', t => {
  function action(event) {
    t.equal(event.detail.rows.length, 2);
  }

  t.plan(2);

  table.addEventListener('action', action);

  tableSelect.selectRow(rows[1]);
  tableSelect.selectRow(rows[2], true);
  table.dispatchEvent(new KeyCodeEvent('keydown', 13));

  setTimeout(() => {
    table.removeEventListener('action', action);
    tableSelect.deselectAll();
    t.ok(true);
  });
});

test('post dispatch', t => {
  tableSelect.destroy();
  t.end();
});
