var assert = require('assert')
  , FreshBooks = require('../');

describe('Estimate', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , estimate = new freshbooks.Estimate();

  describe("create()", function() {
    it("should create a new estimate", function(done) {
      estimate.client_id = 2;

      estimate.lines.push({name: 'Test'
                        , unit_cost: '5.00'
                        , quantity: '5'
                        , type: 'Item'});

      estimate.create(function(err, estimate) {
        done(err);
      });
    });
  });

  describe("update()", function() {
    it("should update an estimate", function(done) {
      estimate.notes = "Lorem Ipsum";
      estimate.update(function(err, estimate) {
        done(err);
      });
    });
  });

  describe("get()", function() {
    it("should get an estimate", function(done) {
      estimate.get(estimate.estimate_id, function(err, estimate) {
        done(err);
      });
    });
  });  
  
  describe("sendByEmail()", function() {
    it("should send an estimate by email", function(done) {
      estimate.sendByEmail(function(err, estimate) {
        done(err);
      });
    });
  });  
  
  describe("list()", function() {
    it("should list an array of estimates", function(done) {
      estimate.list({"client_id": estimate.client_id}, function(err, estimates) {
        done(err);
      });
    });
  });

  describe("delete()", function() {
    it("should delete an estimate", function(done) {
      estimate.delete(function(err, estimate) {
        done(err);
      });
    });
  });  
});