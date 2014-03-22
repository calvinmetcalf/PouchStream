var Transform = require('readable-stream').Transform;
var inherits = require('inherits');
var PouchDB = require('pouchdb');
inherits(PouchStream, Transform);
module.exports = PouchStream;
function PouchStream(db, opts) {
  opts = opts || {};
  this.batchSize = opts.batchSize || 100;
  if (typeof db === 'string') {
    this.db = new PouchDB(db, opts);
  } else {
    this.db = db;
  }
}
