var batchdb = require('../');
var test = require('tape');
var concat = require('concat-stream');
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

test('run', function (t) {
    var expected = [
        [ 0, false, 'whoa\n' ],
        [ 0, false, 'beep\n' ],
        [ 1, true, '' ]
    ];
    t.plan(expected.length * 3);
    
    var compute = batchdb(db, { path: path.join(tmpdir, 'blobs') });
    compute.add().end('echo whoa');
    compute.add().end('echo beep');
    compute.add().end('blorp23412jasdf');
    
    compute.on('result', function (key, id) {
        var ex = expected.shift();
        var ps = compute.getOutput(id);
        ps.on('exit', function (code) {
            t.equal(Boolean(code), Boolean(ex[0]));
        });
        ps.stderr.pipe(concat(function (body) {
            t.equal(ex[1], body.length > 0);
        }));
        ps.stdout.pipe(concat(function (body) {
            t.equal(body.toString('utf8'), ex[2]);
        }));
    });
    compute.run();
});
