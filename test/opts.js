var batchdb = require('../');
var test = require('tape');
var mkdirp = require('mkdirp');
var tmpdir = require('osenv').tmpdir;

var path = require('path');
var tmpdir = path.join(
    tmpdir(),
    'batchdb-shell.' +
    Math.random()
);
mkdirp.sync(tmpdir);
var db = require('level')(path.join(tmpdir, 'db'));

test('opts', function (t) {
    var compute = batchdb(db);
    t.end();
});
