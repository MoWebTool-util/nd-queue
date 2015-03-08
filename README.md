# nd-queue

[![spm version](http://spmjs.io/badge/nd-queue)](http://spmjs.io/package/nd-queue)

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
q.use(function(next) {
  if (true) {
    next();
  }
});

// use functions
q.use([function(next) {
  if (true) {
    next();
  }
}, function(next) {
  if (true) {
    next();
  }
}]);

// run queue
q.run();

// or run queue with callback
q.run(function() {
  console.log('all done!');
});
```
