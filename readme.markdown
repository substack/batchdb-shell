# batchdb-shell

job queue for shell scripts, writing output to blob storage

[![build status](https://secure.travis-ci.org/substack/batchdb-shell.png)](http://travis-ci.org/substack/batchdb-shell)

# example

## queue a shell command

push a shell command onto the queue:

``` js
var batchdb = require('batchdb-shell');
var db = require('level')('/tmp/compute.db');

var compute = batchdb(db, { path: '/tmp/compute.blobs' });
var cmd = process.argv.slice(2).join(' ');
compute.add().end(cmd);
```

## run a command

run the queued commands, one after the other:

``` js
var batchdb = require('batchdb-shell');
var db = require('level')('/tmp/compute.db');
var compute = batchdb(db, { path: '/tmp/compute.blobs' });

compute.on('result', function (key, id) {
    console.log('RESULT', id);
});

compute.run();
```

## show a result

show the result of a command, printing colorized results for stderr and stdout:

`` js
var batchdb = require('batchdb-shell');
var colorize = require('ansi-color-stream');
var db = require('level')('/tmp/compute.db');
var compute = batchdb(db, { path: '/tmp/compute.blobs' });

var id = process.argv[2];
var p = compute.getOutput(id)

p.stdout.pipe(colorize('green')).pipe(process.stdout);
p.stderr.pipe(colorize('red')).pipe(process.stderr);
```

## example output

```
$ node add.js date
$ node add.js 'date; uptime'
$ node add.js 'blah'
$ node run.js 
RESULT f15843b6c84fc23bd48623dc259968e759dd6bc0b84e69dd504d89f34f59e261
RESULT 82d7fce3b92dae949e8cd5b963c7bbf0948fa04a71b0752eed4fa1dae12a0726
RESULT 011a9bed9ed841dbc2be80244322904cd86a5f83ef15f1489f5acc9be416a8c1
$ node show.js f15843b6c84fc23bd48623dc259968e759dd6bc0b84e69dd504d89f34f59e261
Fri Sep  5 00:35:56 PDT 2014
$ node show.js 82d7fce3b92dae949e8cd5b963c7bbf0948fa04a71b0752eed4fa1dae12a0726
Fri Sep  5 00:35:56 PDT 2014
 00:35:56 up 2 days,  9:35,  8 users,  load average: 1.41, 1.13, 1.05
$ node show.js 011a9bed9ed841dbc2be80244322904cd86a5f83ef15f1489f5acc9be416a8c1
/bin/bash: line 1: blah: command not found
```

# methods

``` js
var batchdb = require('batchdb-shell')
```

## var compute = batchdb(db, opts)

Return a `compute` instance with all the methods from
[batchdb](https://www.npmjs.org/package/batchdb) plus the extra ones documented
here.

The jobs will be spawned in `opts.shell`, which defaults to the `$SHELL`
environment variable or `'cmd'` on windows and `'sh'` everywhere else.

The stderr and stdout of spawned processes are packed by
[multiplex](https://npmjs.org/package/multiplex) and can be unpacked again with
`compute.getOutput()`.

Just like batchdb, you can pass in a custom `opts.store`.

## var sh = compute.getOutput(key)

Return an object `sh` with `stdout` and `stderr` readable stream properties from
the results of the result identified by the result key `key`.

This is similar to `compute.getResult(key)`, but with decoded channels.

# install

With [npm](https://npmjs.org) do:

```
npm install batchdb-shell
```

# license

MIT
