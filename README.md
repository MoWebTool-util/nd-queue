# nd-queue

[![spm version](http://spm.crossjs.com/badge/nd-queue)](http://spm.crossjs.com/package/nd-queue)

> 简单的队列执行控制。

## 安装

```bash
$ spm install nd-queue --save
```

## 使用

```js
var Queue = require('nd-queue');

// new Queue
var q ＝ new Queue();

// use function
q.use(function([arg1, arg2, ...], next) {
  // do some (a)sync job, then
  if (true) {
    next();
  }
});

// use functions
q.use([function([arg1, arg2, ...], next) {
  if (true) {
    next();
  }
}, function([arg1, arg2, ...], next) {
  if (true) {
    next();
  }
}]);

// run queue
q.run([arg1, arg2, ...]);

// or run queue with callback
q.run([arg1, arg2, ...], function([arg1, arg2, ...]) {
  console.log('all done!');
});
```

```js
// mixin to classes

var Queue = require('nd-queue');

var WidgetHasQueue = Widget.extend({

  // 使用 handlebars
  Implements: [Queue]

  ...
});
```
