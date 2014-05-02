'use strict';

var PouchDB = require('pouchdb');
var random = require('random-document-stream');
var PouchStream = require('../');
PouchDB.plugin(PouchStream);
var test = require('tape');
var batcher = require('../batcher');
var through = require('through2').obj;

test('basic', function (t) {
  var db = new PouchDB('testDB');
  t.test('put stuff in', function (t) {
    random(100).pipe(db.createWriteStream()).on('finish', function () {
      db.allDocs().then(function (resp) {
        t.equals(resp.rows.length, 100, 'all put in');
        t.end();
      });
    });
  });
  t.test('take stuff out', function (t) {
    var called = 0;
    db.createReadStream().pipe(through(function (d, _, next) {
      called++;
      next();
    }, function (next) {
      t.equal(called, 100);
      t.end();
      next();
    }));
  });
  t.test('delete db', function (t) {
    db.destroy(function () {
      t.end();
    });
  });
});
test('batched', function (t) {
  var db = new PouchDB('testDB2');
  t.test('put stuff in', function (t) {
    random(100).pipe(batcher(14)).pipe(db.createWriteStream()).on('finish', function () {
      t.end();
    });
  });
  t.test('take stuff out', function (t) {
    var called = 0;
    db.createReadStream().on('data', function (d) {
      called++;
    }).on('end', function () {
      t.equal(called, 100);
      t.end();
    });
  });
  t.test('delete db', function (t) {
    db.destroy(function () {
      t.end();
    });
  });
});
test('basic 2', function (t) {
  var db = new PouchDB('testDB');
  t.test('put stuff in', function (t) {
    var changes = db.changes({
      live: true
    });
    var called = 0;
    changes.on('change', function () {
      called++;
    });
    db.on('done', function () {
      t.equal(called, 100);
      t.end();
    });
    random(100).pipe(db);
  });
  t.test('take stuff out', function (t) {
    var called = 0;
    db.createReadStream().pipe(through(function (d, _, next) {
      called++;
      next();
    }, function (next) {
      t.equal(called, 100);
      t.end();
      next();
    }));
  });
  t.test('delete db', function (t) {
    db.destroy(function () {
      t.end();
    });
  });
});