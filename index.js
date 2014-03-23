var Transform = require('readable-stream').Transform;
var inherits = require('inherits');
var PouchDB = require('pouchdb');
inherits(PouchStream, Transform);
module.exports = PouchStream;
function PouchStream(db, opts) {
  if (!(this instanceof PouchStream)) {
    return new PouchStream(db, opts);
  }
  Transform.call(this, {
    objectMode: true,
    decodeStrings: false
  });
  opts = opts || {};
  this.batchSize = opts.batchSize || 100;
  if ('new_edits' in opts) {
    this.opts = {new_edits : opts.new_eits};
  } else {
    this.opts = {};
  }
  this.db = db;
  this.queue = [];
}

PouchStream.prototype._transform = function (chunk, _, next) {
  this.queue.push(chunk);
  if (this.queue.length < this.batchSize) {
    return next();
  }
  this._flush(next);
};
PouchStream.prototype._flush = function (next) {
  var self = this;
  var payload = {
    docs: this.queue
  };
  this.queue = [];
  this.db.bulkDocs(payload, this.opts).then(function (resp) {
    resp.forEach(function (thing) {
      self.push(thing);
    });
    next();
  }, next);
};
