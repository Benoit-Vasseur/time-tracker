var assert = require('assert')
  , FreshBooks = require('../');

describe('Time Entry', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , time_entry = new freshbooks.Time_Entry();

  describe("create()", function() {
    it("should create a new time entry", function(done) {
      time_entry.project_id = 1;
      time_entry.task_id = 1;

      time_entry.create(function(err, time_entry) {
        done(err);
      });
    });
  });

  describe("update()", function() {
    it("should update a time entry", function(done) {
      time_entry.hours = "25.00";
      
      time_entry.update(function(err, time_entry) {
        done(err);
      });
    });
  });

  describe("get()", function() {
    it("should get a time entry", function(done) {
      time_entry.get(time_entry.time_entry_id, function(err, time_entry) {
        done(err);
      });
    });
  });  

  describe("list()", function() {
    it("should list an array of time entries", function(done) {
      time_entry.list(function(err, time_entries) {
        done(err);
      });
    });
  });

  describe("delete()", function() {
    it("should delete a time entry", function(done) {
      time_entry.delete(function(err, time_entry) {
        done(err);
      });
    });
  });  
});