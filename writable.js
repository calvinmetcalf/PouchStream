'use strict';
var inherits = require('inherits');
var Writable = require('readable-stream').Writable;

module.exports = WriteStream;
inherits(WriteStream, Writable);

function WriteStream(db) {
  if (!(this instanceof WriteStream)) {
    return new WriteStream(db);
  }
  Writable.call(this, {
    objectMode: true
  });
  this.db = db;
}

WriteStream.prototype._write = function (chunk, _, next) {
  if ('_id' in chunk) {
    this.db.put(chunk).then(function () {
      next();
    }, next);
  } else {
    this.db.post(chunk).then(function () {
      next();
    }, next);
  }
};