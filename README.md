# table-select

Allows you to select table row elements like in your standard finder environment.
Built in support `control`, `shift`, `enter` and the arrow keys.

[Demo](http://rusty1s.github.io/table-select)

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

You can configure the default options by setting them via:

```js
import { setDefaultOptions} from 'table-select';

setDefaultOptions({
  ...
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
Simply run `npm test` to test and `npm start` to compile before submitting pull requests.

## Issues

Please use the [GitHub issue tracker](https://github.com/rusty1s/table-select/issues)
to raise any problems or feature requests.
