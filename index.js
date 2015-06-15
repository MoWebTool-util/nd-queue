/**
 * @module Queue
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var slice = Array.prototype.slice;

var parse = function(args) {
  var done;
  var fail;

  if (args.length && typeof args[args.length - 1] === 'function') {
    done = args.pop();
  }

  if (args.length && typeof args[args.length - 1] === 'function') {
    fail = done;
    done = args.pop();
  }

  return {
    args: args,
    done: done,
    fail: fail
  };
};

var Queue = function() {
  this.stack = {};
};

Queue.prototype.use = function(fn, ctx) {
  if (!this.stack) {
    this.stack = {};
  }

  if (!ctx) {
    ctx = 'ctx';
  }

  ctx = this.stack[ctx] || (this.stack[ctx] = []);

  if (!Array.isArray(fn)) {
    fn = [fn];
  }

  fn.forEach(function(fn) {
    ctx.push(fn);
  });

  return this;
};

Queue.prototype.run = function() {
  var stack = this.stack;
  var fns = [];
  var i = 0;

  var parsed = parse(slice.call(arguments));

  // flatten
  if (stack) {
    Object.keys(stack).forEach(function(key) {
      fns = fns.concat(stack[key]);
    });
  }

  function fail() {
    if (parsed.fail) {
      parsed.fail.apply(null, parsed.args);
    }
  }

  (function done() {
    var fn = fns[i++];

    if (fn) {
      fn.apply(null, parsed.args.concat(done, fail));
    } else if (parsed.done) {
      parsed.done.apply(null, parsed.args);
    }
  })();
};

Queue.prototype.any = function() {
  var stack = this.stack;
  var fns = [];

  var parsed = parse(slice.call(arguments));

  // flatten
  if (stack) {
    Object.keys(stack).forEach(function(key) {
      fns = fns.concat(stack[key]);
    });
  }

  var ok;
  var done = function() {
    // if one done
    if (!ok && parsed.done) {
      ok = true;
      parsed.done.apply(null, parsed.args);
    }
  };

  var i = 0;
  var n = fns.length;
  function fail() {
    // if all failed
    if (++i === n && parsed.fail) {
      parsed.fail.apply(null, parsed.args);
    }
  }

  fns.forEach(function(fn) {
    fn.apply(null, parsed.args.concat(done, fail));
  });
};

Queue.prototype.all = function() {
  var stack = this.stack;
  var fns = [];

  var parsed = parse(slice.call(arguments));

  // flatten
  if (stack) {
    Object.keys(stack).forEach(function(key) {
      fns = fns.concat(stack[key]);
    });
  }

  var i = 0;
  var n = fns.length;
  var done = function() {
    // if all done
    if (++i === n && parsed.done) {
      parsed.done.apply(null, parsed.args);
    }
  };

  var no;
  var fail = function() {
    // if one done
    if (!no && parsed.fail) {
      no = true;
      parsed.fail.apply(null, parsed.args);
    }
  };

  fns.forEach(function(fn) {
    fn.apply(null, parsed.args.concat(done, fail));
  });
};

module.exports = Queue;
