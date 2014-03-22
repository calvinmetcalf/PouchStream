var test = require('tape');
var pStream = require('../');
var PouchDB = require('pouchdb');
var through = require('through2').obj;

test('basic', function (t) {
  var db = new PouchDB('testBasic');
  t.test('test', function (t) {
    var stream = new pStream(db);
    stream.on('error', function (err) {
      t.error(err);
    });
    var out = [];
    var oStream = through(function (chunk, _, next) {

      out.push(chunk);
      next();
    }, function (next) {
        t.equals(2, out.length, 'should be 2 docs');
        t.end();
        next();
    });
     stream.pipe(oStream);
    stream.write({name: 'jeff'}, function () {
      stream.write({name: 'henry'}, function () {
        stream.end();
      });
    });

  });

  t.test('after', function (t) {
    db.destroy(function () {
      t.end();
    });
  });
});

test('advanced', function (t) {
  var db = new PouchDB('testAdvanced');
  t.test('test', function (t) {
    var stream = new pStream(db, {batchSize: 3});
    var out = [];
    var oStream = through(function (chunk, _, next) {
      out.push(chunk);
      next();
    }, function (next) {
        t.equals(5, out.length, 'should be 5 docs');
        t.end();
        next();
    });
    stream.pipe(oStream);
    stream.write({name: 'jeff'});
    stream.write({name: 'henry'});
    stream.write({name: 'james'});
    stream.write({name: 'greg'});
    stream.write({name: 'nick'});
    stream.end();
  });

  t.test('after', function (t) {
    db.destroy(function () {
      t.end();
    });
  });
});
test('super advanced', function (t) {
  var db = new PouchDB('testSuperAdvanced');
  t.test('test', function (t) {
    var stream = new pStream(db, {batchSize: 10});
    var out = [];
    var oStream = through(function (chunk, _, next) {
      out.push(chunk);
      next();
    }, function (next) {
        t.equals(50, out.length, 'should be 50 docs');
        t.end();
        next();
    });
    stream.pipe(oStream);
    var i = 50;
    function putIt () {
      stream.write({'_id':'' + (i--)}, function (err){
        if (err) {
          t.error(err);
        }
        if (i) {
          process.nextTick(putIt);
        } else {
          stream.end();
        }
      });
    }
    putIt();
  });

  t.test('after', function (t) {
    db.destroy(function () {
      t.end();
    });
  });
});