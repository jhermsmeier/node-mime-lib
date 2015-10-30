var fs = require('fs');
var path = require('path')
var lodash = require('lodash');

var extensions = {};
var types = {};

var lines = ['{'];


fs.readFileSync(path.join(__dirname, 'mime.types' ), 'utf-8')
    .split(/\r?\n/)
    .forEach(function (exts, type) {
        exts = exts.split(/\s+/)
        type = exts.shift()
        var line = lodash.padRight('"' + type + '":', 79, ' ');

        line += '["'
        line += exts.join('", "');
        line += '"],'

        lines.push(line);
        extensions[ type ] = exts
        exts.forEach( function( ext ) {
            types[ ext ] = type
        })
    })

lines.push('"boof": "noob"');
lines.push('}');

fs.writeFileSync(__dirname + '/mime.types.json', lines.join('\n'));

var types = require(__dirname + '/mime.types.json');


var keys = Object.keys(types);

console.log('keys', keys);

for (var k in types) {
    console.log('k', k);
    // console.log('k', types);
    // console.log('v', v);
}

// console.log('types', types);

