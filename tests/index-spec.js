'use strict';

/*globals describe,it,beforeEach,afterEach*/

var expect = require('expect.js');
var Queue = require('../index.js');

describe('run', function() {

  var queue;
  var i;
  var a;

  beforeEach(function() {
    queue = new Queue();
    i = 0;
    a = {};
  });

  it('with done', function() {
    queue.use(function(done) {
      i += 1;
      done();
    });

    queue.run(function() {
      expect(i).to.be(1);

      i += 2;
    });

    expect(i).to.be(3);
  });

  it('without done', function() {
    queue.use(function(done) {
      i += 1;
      done();
    });

    queue.run();

    expect(i).to.be(1);
  });

  it('with params', function() {
    queue.use(function(a, done) {
      a.index = i += 1;
      done();
    });

    queue.run(a);

    expect(a.index).to.be(1);
  });

  it('does not go through', function() {
    queue.use(function(done) {
      i += 1;
      done();
    });

    queue.use(function(done, fail) {
      i += 2;
      fail();
    });

    queue.use(function(done) {
      // this would not be executed
      i += 4;
      done();
    });

    queue.run(function() {
      // this would not be executed
      expect().fail('this would not be executed');
    }, function() {
      // this would be executed
      i += 8;
    });

    expect(i).to.be(11);
  });

  afterEach(function() {
    queue = null;
  });

});

describe('any', function() {

  var queue;

  beforeEach(function() {
    queue = new Queue();
  });

  it('with async', function(done) {
    var i = 0;

    queue.use(function(done) {
      setTimeout(function() {
        i += 1;
        done();
      }, 10);
    });

    queue.use(function(done) {
      setTimeout(function() {
        i += 2;
        done();
      }, 10);
    });

    queue.any(function() {
      expect(i).to.be(1);
      done();
    });
  });

  it('with async, later first', function(done) {
    var i = 0;

    queue.use(function(done) {
      setTimeout(function() {
        i += 1;
        done();
      }, 30);
    });

    queue.use(function(done) {
      setTimeout(function() {
        i += 2;
        done();
      }, 10);
    });

    setTimeout(function() {
      expect(i).to.be(2);
    }, 20);

    queue.any(function() {
      expect(i).to.be(2);
      done();
    });
  });

  it('without done', function(done) {
    var i = 0;

    queue.use(function(done) {
      setTimeout(function() {
        i += 1;
        done();
      }, 10);
    });

    queue.use(function(done) {
      setTimeout(function() {
        i += 2;
        done();
      }, 30);
    });

    queue.any();

    setTimeout(function() {
      expect(i).to.be(1);
    }, 20);

    setTimeout(function() {
      expect(i).to.be(3);
      done();
    }, 40);
  });

  it('does not go through', function() {
    var i = 0;

    queue.use(function(done, fail) {
      i += 1;
      fail();
    });

    queue.use(function(done, fail) {
      i += 2;
      fail();
    });

    queue.use(function(done, fail) {
      // this would not be executed
      i += 4;
      fail();
    });

    queue.any(function() {
      // this would not be executed
      expect().fail('this would not be executed');
    }, function() {
      // this would be executed
      i += 8;
    });

    expect(i).to.be(15);
  });

  afterEach(function() {
    queue = null;
  });

});

describe('all', function() {

  var queue;

  beforeEach(function() {
    queue = new Queue();
  });

  it('with async', function(done) {
    var i = 0;

    queue.use(function(done) {
      setTimeout(function() {
        i += 1;
        done();
      }, 10);
    });

    queue.use(function(done) {
      setTimeout(function() {
        i += 2;
        done();
      }, 10);
    });

    queue.all(function() {
      expect(i).to.be(3);
      done();
    });
  });

  it('with async, later first', function(done) {
    var i = 0;

    queue.use(function(done) {
      setTimeout(function() {
        i += 1;
        done();
      }, 30);
    });

    queue.use(function(done) {
      setTimeout(function() {
        i += 2;
        done();
      }, 10);
    });

    setTimeout(function() {
      expect(i).to.be(2);
    }, 20);

    queue.all(function() {
      expect(i).to.be(3);
      done();
    });
  });

  it('without done', function(done) {
    var i = 0;

    queue.use(function(done) {
      setTimeout(function() {
        i += 1;
        done();
      }, 10);
    });

    queue.use(function(done) {
      setTimeout(function() {
        i += 2;
        done();
      }, 30);
    });

    queue.all();

    setTimeout(function() {
      expect(i).to.be(1);
    }, 20);

    setTimeout(function() {
      expect(i).to.be(3);
      done();
    }, 40);
  });

  it('does not go through', function() {
    var i = 0;

    queue.use(function(done, fail) {
      i += 1;
      done();
    });

    queue.use(function(done, fail) {
      i += 2;
      fail();
    });

    queue.use(function(done, fail) {
      // this would not be executed
      i += 4;
      done();
    });

    queue.all(function() {
      // this would not be executed
      expect().fail('this would not be executed');
    }, function() {
      // this would be executed
      i += 8;
    });

    expect(i).to.be(15);
  });

  afterEach(function() {
    queue = null;
  });

});
