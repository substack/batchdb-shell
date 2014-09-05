var batchdb = require('../');
var os = require('os');
var test = require('tape');
var concat = require('concat-stream');
var mkdirp = require('mkdirp');

var path = require('path');
var tmpdir = path.join(
    (os.tmpdir || os.tmpDir)(),
    'batchdb-shell.' +
    Math.random()
);
mkdirp.sync(tmpdir);
var db = require('level')(path.join(tmpdir, 'db'));

test('run', function (t) {
    var expected = [
        [ false, 'whoa\n' ],
        [ false, 'beep\n' ],
        [ true, '' ]
    ];
    t.plan(expected.length * 2);
    
    var compute = batchdb(db, { path: path.join(tmpdir, 'blobs') });
    compute.add().end('echo whoa');
    compute.add().end('echo beep');
    compute.add().end('blorp23412jasdf');
    
    compute.on('result', function (key, id) {
        var ex = expected.shift();
        var ps = compute.getOutput(id);
        ps.stderr.pipe(concat(function (body) {
            t.equal(ex[0], body.length > 0);
        }));
        ps.stdout.pipe(concat(function (body) {
            t.equal(body.toString('utf8'), ex[1]);
        }));
    });
    compute.run();
});
