var libxml = require('libxmljs');

/**
 * Creates a new Category.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Category}
 * @api public
 */
 
var Category = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Category.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
  
  switch(method) {
    case "category.create":
    case "category.update":
      var category = request.node("category");
        
      for(var key in this) {
        if("function" !== typeof this[key]) {
          
          switch(key) {
            //Catch resulting values that can't be created/updated.
            case "freshbooks":
            case "updated":
            break;
            
            default:
              category.node(key).text(this[key]);  
            break;
          }
        }
      }
    break;
      
    case "category.get":
    case "category.delete":    
      request.node("category_id").text(self.category_id);
    break;
    
    case "category.list":
    break;
  }

  fn(xml);
};

/**
 * Sets Category properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Category.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:category", this.freshbooks.ns).childNodes();
  
  for(var x=0; x < nodes.length; x++) {
    if("text" !== nodes[x].name()) {
      switch(nodes[x].name()) {
        default:
          this[nodes[x].name()] = nodes[x].text();
        break;
      }
    }
  }
  fn();
};

/**
 * Creates a Category.
 * 
 * @param {Function} fn
 * @api public
 */
 
Category.prototype.create = function(fn) {
  var self = this;
  
  this._setXML("category.create", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT CREATE CATEGORY: " + err));
      } else {
        self.category_id = xml.get("//xmlns:category_id", self.freshbooks.ns).text();
        self.get(self.category_id, fn);
      }
    });
  });
};

/**
 * Updates an Category.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Category.prototype.update = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.category_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("category.update", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT UPDATE CATEGORY: " + err));
      } else {
        self.get(self.category_id, fn);
      }
    });
  });
};

/**
 * Gets an Category.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Category.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.category_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("category.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET CATEGORY: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Deletes an Category.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Category.prototype.delete = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.category_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("category.delete", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT DELETE CATEGORY: " + err));
      } else {
        fn();
      }
    });
  });
};

/**
 * List Categories.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Category.prototype.list = function(fn) {
  var self = this
    , options = [];
    
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
    
  this._setXML("category.list", function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST CATEGORIES: " + err));
      } else {
        var categories = xml.get("//xmlns:categories", self.freshbooks.ns)
          , options = { page: categories.attr("page").value()
                      , per_page: categories.attr("per_page").value()
                      , pages: categories.attr("pages").value()
                      , total: categories.attr("total").value() }
            categories = [];
            
        xml.find("//xmlns:category", self.freshbooks.ns).forEach(function(a) {
          var category = new self.freshbooks.Category();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          category._getXML(xml, function() {
            categories.push(category);
          });
        });
        
        fn(null, categories, options);
      }
    });
  });
};