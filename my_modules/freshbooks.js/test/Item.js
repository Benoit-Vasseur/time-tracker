var assert = require('assert')
  , FreshBooks = require('../');

describe('Item', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , item = new freshbooks.Item();

  describe("create()", function() {
    it("should create a new item", function(done) {
      item.name = "Test Item" + Math.random();

      item.create(function(err, item) {
        done(err);
      });
    });
  });

  describe("update()", function() {
    it("should update an item", function(done) {
      item.description = "Test Item";
      
      item.update(function(err, item) {
        done(err);
      });
    });
  });

  describe("get()", function() {
    it("should get an item", function(done) {
      item.get(item.item_id, function(err, item) {
        done(err);
      });
    });
  });  

  describe("list()", function() {
    it("should list an array of items", function(done) {
      item.list(function(err, items) {
        done(err);
      });
    });
  });

  describe("delete()", function() {
    it("should delete an item", function(done) {
      item.delete(function(err, item) {
        done(err);
      });
    });
  });  
});