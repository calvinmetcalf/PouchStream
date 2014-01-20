var PouchDB = require("pouchdb");
var should = require("chai").should;
var PouchStream = require('../');

describe('PouchStream', function(){
  var db;
  function before(done){
    new PouchDB('test', function(err, d){
        db = d;
        done(err);
    });
  }
  function after(done){
    PouchDB.destroy('test', function(err){
      done(err);
    })
  }
  it('should work', function(done){
    done();
  });
});