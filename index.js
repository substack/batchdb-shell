var inherits = require('inherits');
var spawn = require('child_process').spawn;
var multiplex = require('multiplex');
var parseShell = require('shell-quote').parse;
var BatchDB = require('batchdb');
var duplexer = require('duplexer2');
var defined = require('defined');
var extend = require('xtend');

var defaultShell = /^win/.test(process.platform) ? 'cmd' : 'sh';

module.exports = Compute;
inherits(Compute, BatchDB);

function Compute (db, opts) {
    if (!(this instanceof Compute)) return new Compute(db, opts);
    if (!opts) opts = {};
    BatchDB.call(this, db, extend({ run: run }, opts));
    
    var sh = defined(opts.shell, process.env.SHELL, defaultShell);
    if (typeof sh === 'string') sh = parseShell(sh);
    
    function run () {
        var ps = spawn(sh[0], sh.slice(1));
        var m = multiplex();
        ps.stdout.pipe(m.createStream(1));
        ps.stderr.pipe(m.createStream(2));
        
        var pending = 2;
        function onend () { if (--pending === 0) m.end() }
        ps.stdout.once('end', onend);
        ps.stderr.once('end', onend);
        return duplexer(ps.stdin, m);
    }
};

Compute.prototype.getOutput = function (key) {
    var r = this.getResult(key);
    if (!r) return;
    var m = multiplex();
    var p = {
        stdout: m.createStream(1),
        stderr: m.createStream(2)
    };
    r.pipe(m);
    return p;
};
