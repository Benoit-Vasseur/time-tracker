var assert = require('assert')
  , FreshBooks = require('../');

describe('Gateway', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , gateway = new freshbooks.Gateway();

  describe("list()", function() {
    it("should list an array of gateways", function(done) {
      gateway.list(function(err, gateways) {
        done(err);
      });
    });
  });
});