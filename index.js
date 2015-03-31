/**
 * @module: nd-queue
 * @author: crossjs <liwenfu@crossjs.com> - 2015-03-08 23:04:31
 */

'use strict';

var slice = Array.prototype.slice;

var Queue = function() {
  this.stack = [];
};

Queue.prototype.use = function(fn) {
  this.stack = this.stack.concat(fn);

  return this;
};

Queue.prototype.run = function() {
  var stack = this.stack;
  var i = 0;

  var args = slice.call(arguments);
  var cb;

  if (args.length && typeof args[args.length -1] === 'function') {
    cb = args.pop();
  }

  (function next() {
    var fn = stack[i++];

    if (fn) {
      fn.apply(null, args.concat(next));
    } else if (cb) {
      cb();
    }

  })();
};

module.exports = Queue;
