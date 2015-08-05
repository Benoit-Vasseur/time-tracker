var assert = require('assert')
  , FreshBooks = require('../');

describe('Project', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , project = new freshbooks.Project();

  describe("create()", function() {
    it("should create a new project", function(done) {
      project.name = "Test Project";
      project.bill_method = "task-rate";

      project.create(function(err, project) {
        done(err);
      });
    });
  });

  describe("update()", function() {
    it("should update a project", function(done) {
      project.rate = "25.00";
      
      project.update(function(err, project) {
        done(err);
      });
    });
  });

  describe("get()", function() {
    it("should get a project", function(done) {
      project.get(project.project_id, function(err, project) {
        done(err);
      });
    });
  });  

  describe("list()", function() {
    it("should list an array of projects", function(done) {
      project.list(function(err, projects) {
        done(err);
      });
    });
  });

  describe("delete()", function() {
    it("should delete a project", function(done) {
      project.delete(function(err, project) {
        done(err);
      });
    });
  });  
});
