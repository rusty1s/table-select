'use strict';

import { test } from 'tape';

test('setup', t => {
  document.body.innerHTML = '' +
    '<table>' +
    '  <tbody>' +
    '    <tr>' +
    '      <td>0</td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td>1</td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td>2</td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td>3</td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td>4</td>' +
    '    </tr>' +
    '  </tbody>' +
    '</table>';

  const rows = Array.from(document.querySelectorAll('tr'));
  t.equal(rows.length, 5);

  rows.forEach((row, index) => {
    t.equal(row.querySelector('td').innerHTML, index.toString());
  });

  t.end();
});
