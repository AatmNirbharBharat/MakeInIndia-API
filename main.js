'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var https = _interopDefault(require('https'));
var fs = require('fs');

const sheetURL = process.env.SHEET_URL;

https.get(sheetURL, resp => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    data = JSON.parse(data);
    data = data.feed.entry;
    const headers = data
      .filter(e => e.gs$cell.row === '1')
      .map(e => e.gs$cell.$t)
      .map(e => e.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g))
      .map(e => e.join('_'))
      .map(e => e.toLowerCase());

    let result = [];

    data
      .filter(e => e.gs$cell.row !== '1')
      .map((e, index) => {
        let { row, col, inputValue: value } = e.gs$cell;
        row = parseInt(row);
        col = parseInt(col);

        if (!result[row]) result[row] = [];
        result[row][col] = value;
      });

    result = result
      .filter(e => e !== undefined)
      .map(e => e.slice(1))
      .map(e => {
        const temp = {};
        headers.map((header, index) => {
          const value = e[index] && e[index].split('\n').length > 1 ? e[index].split('\n') : e[index];
          temp[header] = value || null;
        });
        return temp
      });

    result = JSON.stringify(result, null, '  ');

    if (!fs.existsSync('build/v1')) fs.mkdirSync('build/v1');
    fs.writeFileSync('build/v1/products.json', result);
    console.log('v1 products completed');
  });
});
