var batchdb = require('../');
var colorize = require('ansi-color-stream');
var db = require('level')('/tmp/compute.db');
var compute = batchdb(db, { path: '/tmp/compute.blobs' });

var id = process.argv[2];
var p = compute.getOutput(id)

p.stdout.pipe(colorize('green')).pipe(process.stdout);
p.stderr.pipe(colorize('red')).pipe(process.stderr);
