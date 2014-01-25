var PouchDB = require("pouchdb");
var should = require("chai").should();
var PouchStream = require('../');

describe('PouchStream', function(){
  var db;
  beforeEach(function (done){
    new PouchDB('_test', function(err, d){
        db = d;
        done(err);
    });
  });
  afterEach(function (done){
    PouchDB.destroy('_test', function(err){
      done(err);
    })
  });
  it('should work', function(done){
    var stream = new PouchStream(db);
    db.put({"_id":"lala","key":"value"}, function(){
      stream.on('data', function(doc){
        doc._id.should.equal('lala');
        doc.key.should.equal('value');
        done();
      });
      stream.read();
    });
  });
});