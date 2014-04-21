'use strict';
var inherits = require('inherits');
var Readable = require('readable-stream').Readable;

module.exports = ReadStream;
inherits(ReadStream, Readable);

function ReadStream(db, since) {
  if (!(this instanceof ReadStream)) {
    return new ReadStream(db, since);
  }
  Readable.call(this, {
    objectMode: true
  });
  this.last = since || 0;
  this.db = db;
}
ReadStream.prototype._read = function () {
  if (this.changes) {
    return;
  }
  var self = this;
  this.changes = this.db.changes({
    since: this.last,
    returnDocs: false,
    include_docs: true
  }).on('complete', function (resp) {
    delete self.cancel;
    if (!resp.canceled) {
      self.push(null);
    }
  });
  this.changes.on('change', function (change) {
    self.last = change.seq;
    var more = self.push(change.doc);
    if (!more) {
      self.changes.cancel();
    }
  });
};