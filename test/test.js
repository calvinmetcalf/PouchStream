'use strict';

var PouchDB = require('pouchdb');
var random = require('random-document-stream');
var PouchStream = require('../');
var test = require('tape');

test('basic', function (t) {
  var db = new PouchDB('testDB');
  t.test('put stuff in', function (t) {
    random(100).pipe(PouchStream.writable(db)).on('finish', function () {
      t.end();
    });
  });
  t.test('put stuff in', function (t) {
    var called = 0;
    PouchStream.readable(db).on('data', function (d) {
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