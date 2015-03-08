/**
 * @module: nd-queue
 * @author: crossjs <liwenfu@crossjs.com> - 2015-03-08 23:04:31
 */

'use strict';

var Queue = function() {
  this.stack = [];
};

Queue.prototype.use = function(fn) {
  this.stack = this.stack.concat(fn);

  return this;
};

Queue.prototype.run = function(cb) {
  var stack = this.stack;
  var i = 0;

  (function next() {
    var fn = stack[i++];

    if (fn) {
      fn(next);
    } else if (cb) {
      cb();
    }

  })();
};

module.exports = Queue;
