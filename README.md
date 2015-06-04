# nd-queue

[![spm version](http://spm.crossjs.com/badge/nd-queue)](http://spm.crossjs.com/package/nd-queue)

> 简单的队列执行控制。

## 安装

```bash
$ spm install nd-queue --save
```

## 使用

特殊用法，混入到类中

```js
// mixin to classes

var Queue = require('nd-queue');

var WidgetHasQueue = Widget.extend({

  // 使用 handlebars
  Implements: [Queue]

  ...
});
```

### run

synchronous. run queue member step by step (one invokes by previous one with `next`).

```js
var queue = new Queue()

// use function
queue.use(function([arg1, arg2, ...], next){
  // do some (a)sync job, then
  next()
})

// use functions
queue.use([function([arg1, arg2, ...], next){
  // do some (a)sync job, then
  next()
}, ...])

// use function with context key (defaults: 'ctx')
queue.use(function([arg1, arg2, ...], next){
  // do some (a)sync job, then
  next()
}, 'upload')

// dynamically pass arguments to queue members
queue.run([arg1, arg2, ... ], [function callback([arg1, arg2, ... ]) {
  // do some callbacks
}])
```

### any

asynchronous. if any member of the queue is finished, call the callback.

### all

asynchronous. if all members of the queue is finished, call the callback.
