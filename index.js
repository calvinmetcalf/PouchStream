var Duplex = require('stream').Duplex;
var util = require('util');
util.inherits(PouchStream, Duplex);
function PouchStream(db, since) {
  var self = this;
  Duplex.call(this, { 
    objectMode: true,
    decodeStrings:false
  });
  self.db = db;
  self.end = false;
  self.db.info(function (err, resp) {
    self.end = resp.update_seq;
    if(self.waiting){
      self.start();
    }
  });
}
PouchStream.prototype.start = function(since) {
  var self = this;
  if(self.changes){
    return;
  }
  var options = {};
  options.continuous = true;
  options.include_docs = true;
  if(since){
    options.since = since;
  } else if (self.last) {
    options.since = self.last;
  }
  options.onChange = function(change) {
    self.last = change.rev;
    if(self.last === self.end){
      self.changes.cancel();
      self.changes = false;
      self.push(null);
    }
    if(!self.push(change.doc)){
      self.changes.cancel();
      self.changes = false;
    }
  }
  options.complete = function(err){
    if (err) {
      self.emit('error', err);
    }
  }
  self.changes = self.db.changes(options);
}
PouchStream.prototype._read = function(){
  if(!this.end){
    this.waiting = true;
    return;
  }
  this.start();
}
PouchStream.prototype._write = function(doc, _, cb){
  var verb;
  if(doc._id){
    verb = 'put';
  }else{
    verb = 'post';
  }
  this.db[verb](doc, cb);
}
module.exports = PouchStream;