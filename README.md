# table-select

Allows you to select table row elements like in your standard finder environment.
Built in support `ctrl`, `shift`, enter and the arrow keys.

Demo

## Quick Start

```html
<script src="table-select.min.js"></script>

<script>
  new TableSelect(document.getElementById('table-id'));
</script>
```

## Browser Support

`table-select` expects `classList` to be supported. For this to work on older versions of
IE, use [a shim](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#classlist).

| <img src="http://i.imgur.com/dJC1GUv.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://i.imgur.com/o1m5RcQ.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://i.imgur.com/8h3iz5H.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://i.imgur.com/iQV4nmJ.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://i.imgur.com/j3tgNKJ.png" width="48px" height="48px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|
| 8+ ✔ | 3.6+ ✔ | 10+ ✔ | 11.50+ ✔ | 5.1+ ✔ |

## Additional options

You can pass in options as a second parameter. The currently supported options are:

* `className`: The class name of the table. Default: `'selectable'`.
* `tabIndex`: The tab index of the table. Default: `1.
* `selectedClassName`: The class name of a selected row. Default: `'selected'`.
* `shouldSelectRow(row)`: Function that determines whether `row` is selectable. 
Default: All rows can be selected.
* `shouldDeselectRow(row)`: Function that determines whether `row` is deselectable.
Default: All rows can be deselected.

```js
new TableSelect(document.getElementById('table-id'), {
  selectedClassName: 'highlighted',
  shouldSelectRow(row) { return !row.classList.contains('unselectable'); },
});
```

### Events

`table-select` supports five custom events:

* `beforeSelect`
* `afterSelect`
* `beforeDeselect`
* `afterDeselect`
* `action`

Specifc information of the event can be found in `event.detail`, e.g.:

```js
var table = document.getElementById('table-id');
var tableSelect = new TableSelect(table);

table.addEventListener('beforeSelect', function(event) {
  console.log('About to select ' + event.detail.row);
});

table.addEventListener('action', function(event) {
  console.log('Perform action for ' + event.detail.rows.length + ' selected row(s)');
});
```

## Node

```js
// npm install table-select
import TableSelect from 'table-select';

const tableSelect = new TableSelect(element, options);
```

## Contributing

If you would like to [submit a pull request](https://github.com/rusty1s/table-select/pulls)
with any changes you make, please feel free!
Simply run `npm run lint` and `npm run compile` before submitting pull requests.

Tests are run via:

```
npm install && npm test
```

## Issues

Please use the [GitHub issue tracker](https://github.com/rusty1s/table-select/issues)
to raise any problems or feature requests.

## License

Copyright (c) 2016 Matthias Fey <matthias.fey@tu-dortmund.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
