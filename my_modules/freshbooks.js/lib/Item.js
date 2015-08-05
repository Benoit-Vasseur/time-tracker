var libxml = require('libxmljs');

/**
 * Creates a new Item.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Item}
 * @api public
 */
 
var Item = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Item.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for item.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  switch(method) {
    case "item.create":
    case "item.update":
      var item = request.node("item");
        
      for(var key in this) {
        if("function" !== typeof this[key]) {
          
          switch(key) {
            //Catch resulting values that can't be created/updated.
            case "freshbooks":
            break;
            
            default:
              item.node(key).text(this[key]);  
            break;
          }
        }
      }
    break;
      
    case "item.get":
    case "item.delete":    
      request.node("item_id").text(self.item_id);
    break;
    
    case "item.list":
      if(null !== options) {
        for(var key in options) {
          if("function" !== typeof options[key]) {
            request.node(key).text(options[key]);  
          }
        }
      } 
    break;
  }

  fn(xml);
};

/**
 * Sets Item properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Item.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:item", this.freshbooks.ns).childNodes();
  
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
 * Creates an Item.
 * 
 * @param {Function} fn
 * @api public
 */
 
Item.prototype.create = function(fn) {
  var self = this;
  
  this._setXML("item.create", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT CREATE ITEM: " + err));
      } else {
        self.item_id = xml.get("//xmlns:item_id", self.freshbooks.ns).text();
        self.get(self.item_id, fn);
      }
    });
  });
};

/**
 * Updates an Item.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Item.prototype.update = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.item_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("item.update", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT UPDATE ITEM: " + err));
      } else {
        self.get(self.item_id, fn);
      }
    });
  });
};

/**
 * Gets an Item.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Item.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.item_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("item.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET ITEM: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Deletes an Item.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Item.prototype.delete = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.item_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("item.delete", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT DELETE ITEM: " + err));
      } else {
        fn();
      }
    });
  });
};

/**
 * List Items.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Item.prototype.list = function(fn) {
  var self = this
    , options = [];
    
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
    
  this._setXML("item.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST ITEMS: " + err));
      } else {
        var items = xml.get("//xmlns:items", self.freshbooks.ns)
          , options = { page: items.attr("page").value()
                      , per_page: items.attr("per_page").value()
                      , pages: items.attr("pages").value()
                      , total: items.attr("total").value() }
            items = [];
            
        xml.find("//xmlns:item", self.freshbooks.ns).forEach(function(a) {
          var item = new self.freshbooks.Item();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          item._getXML(xml, function() {
            items.push(item);
          });
        });
        
        fn(null, items, options);
      }
    });
  });
};