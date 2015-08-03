var assert = require('assert')
  , FreshBooks = require('../');

describe('Language', function() {
  var freshbooks = new FreshBooks("https://freshbooksjs.freshbooks.com/api/2.1/xml-in","59dbd7310470641ff2332bd016ac2e4e")
    , language = new freshbooks.Language();

  describe("list()", function() {
    it("should list an array of languages", function(done) {
      language.list(function(err, languages) {
        done(err);
      });
    });
  });
});