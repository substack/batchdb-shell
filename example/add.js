var batchdb = require('../');
var db = require('level')('/tmp/compute.db');

var compute = batchdb(db, { path: '/tmp/compute.blobs' });
var cmd = process.argv.slice(2).join(' ');
compute.add().end(cmd);
