/**
 * @module Queue
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var slice = Array.prototype.slice;

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

  var args = slice.call(arguments);
  var cb;

  if (args.length && typeof args[args.length - 1] === 'function') {
    cb = args.pop();
  }

  // flatten
  if (stack) {
    Object.keys(stack).forEach(function(key) {
      fns = fns.concat(stack[key]);
    });
  }

  (function done() {
    var fn = fns[i++];

    if (fn) {
      fn.apply(null, args.concat(done));
    } else if (cb) {
      cb.apply(null, args);
    }
  })();
};

Queue.prototype.any = function() {
  var stack = this.stack;
  var fns = [];

  var args = slice.call(arguments);
  var cb;

  if (args.length && typeof args[args.length - 1] === 'function') {
    cb = args.pop();
  }

  // flatten
  if (stack) {
    Object.keys(stack).forEach(function(key) {
      fns = fns.concat(stack[key]);
    });
  }

  var ok;
  var done = function() {
    if (ok) {
      return;
    }

    ok = true;

    if (cb) {
      cb.apply(null, args);
    }
  };

  fns.forEach(function(fn) {
    fn.apply(null, args.concat(done));
  });
};

Queue.prototype.all = function() {
  var stack = this.stack;
  var fns = [];

  var args = slice.call(arguments);
  var cb;

  if (args.length && typeof args[args.length - 1] === 'function') {
    cb = args.pop();
  }

  // flatten
  if (stack) {
    Object.keys(stack).forEach(function(key) {
      fns = fns.concat(stack[key]);
    });
  }

  var i = 0;
  var n = fns.length;
  var done = function() {
    if (++i !== n) {
      return;
    }

    if (cb) {
      cb.apply(null, args);
    }
  };

  fns.forEach(function(fn) {
    fn.apply(null, args.concat(done));
  });
};

module.exports = Queue;
