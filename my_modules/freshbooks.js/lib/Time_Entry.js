var libxml = require('libxmljs');

/**
 * Creates a new Time Entry.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Time Entry}
 * @api public
 */
 
var Time_Entry = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Time_Entry.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for time_entry.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  switch(method) {
    case "time_entry.create":
    case "time_entry.update":
      var time_entry = request.node("time_entry");
        
      for(var key in this) {
        if("function" !== typeof this[key]) {
          
          switch(key) {
            //Catch resulting values that can't be created/updated.
            case "freshbooks":
            case "billed":
            break;
            
            default:
              time_entry.node(key).text(this[key]);  
            break;
          }
        }
      }
    break;
      
    case "time_entry.get":
    case "time_entry.delete":    
      request.node("time_entry_id").text(self.time_entry_id);
    break;
    
    case "time_entry.list":
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
 * Sets Time Entry properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Time_Entry.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:time_entry", this.freshbooks.ns).childNodes();
  
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
 * Creates an Time Entry.
 * 
 * @param {Function} fn
 * @api public
 */
 
Time_Entry.prototype.create = function(fn) {
  var self = this;
  
  this._setXML("time_entry.create", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT CREATE TIME ENTRY: " + err));
      } else {
        self.time_entry_id = xml.get("//xmlns:time_entry_id", self.freshbooks.ns).text();
        self.get(self.time_entry_id, fn);
      }
    });
  });
};

/**
 * Updates an Time Entry.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Time_Entry.prototype.update = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.time_entry_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("time_entry.update", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT UPDATE TIME ENTRY: " + err));
      } else {
        self.get(self.time_entry_id, fn);
      }
    });
  });
};

/**
 * Gets an Time Entry.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Time_Entry.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.time_entry_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("time_entry.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET TIME ENTRY: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Deletes an Time Entry.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Time_Entry.prototype.delete = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.time_entry_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("time_entry.delete", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT DELETE TIME ENTRY: " + err));
      } else {
        fn();
      }
    });
  });
};

/**
 * List Time Entrys.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Time_Entry.prototype.list = function(fn) {
  var self = this
    , options = [];
    
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
    
  this._setXML("time_entry.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST TIME ENTRYS: " + err));
      } else {
        var time_entries = xml.get("//xmlns:time_entries", self.freshbooks.ns)
          , options = { page: time_entries.attr("page").value()
                      , per_page: time_entries.attr("per_page").value()
                      , pages: time_entries.attr("pages").value()
                      , total: time_entries.attr("total").value() }
            time_entries = [];
            
        xml.find("//xmlns:time_entry", self.freshbooks.ns).forEach(function(a) {
          var time_entry = new self.freshbooks.Time_Entry();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          time_entry._getXML(xml, function() {
            time_entries.push(time_entry);
          });
        });
        
        fn(null, time_entries, options);
      }
    });
  });
};