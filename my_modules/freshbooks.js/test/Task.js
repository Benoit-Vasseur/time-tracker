var assert = require('assert')
  , FreshBooks = require('../');

describe('Task', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , task = new freshbooks.Task();

  describe("create()", function() {
    it("should create a new task", function(done) {
      task.name = "Test Task";

      task.create(function(err, task) {
        done(err);
      });
    });
  });

  describe("update()", function() {
    it("should update a task", function(done) {
      task.rate = "25.00";
      
      task.update(function(err, task) {
        done(err);
      });
    });
  });

  describe("get()", function() {
    it("should get a task", function(done) {
      task.get(task.task_id, function(err, task) {
        done(err);
      });
    });
  });  

  describe("list()", function() {
    it("should list an array of tasks", function(done) {
      task.list(function(err, tasks) {
        done(err);
      });
    });
  });

  describe("delete()", function() {
    it("should delete a task", function(done) {
      task.delete(function(err, task) {
        done(err);
      });
    });
  });  
});