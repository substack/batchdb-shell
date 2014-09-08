var inherits = require('inherits');
var spawn = require('child_process').spawn;
var parseShell = require('shell-quote').parse;
var BatchDB = require('batchdb');

var duplexer = require('duplexer2');
var defined = require('defined');
var extend = require('xtend');

var pack = require('shell-pack').pack;
var unpack = require('shell-pack').unpack;

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
        return duplexer(ps.stdin, pack(ps));
    }
};

Compute.prototype.getOutput = function (key) {
    var r = this.getResult(key);
    if (r) return r.pipe(unpack());
};
