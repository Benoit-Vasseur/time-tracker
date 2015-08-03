var libxml = require('libxmljs');

/**
 * Creates a new Staff.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Staff}
 * @api public
 */
 
var Staff = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Staff.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for staff.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  switch(method) {
    case "staff.current":
    case "staff.list":
    break;
    
    case "staff.get":
      request.node("staff_id").text(self.staff_id);
    break;
  }

  fn(xml);
};

/**
 * Sets Staff properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Staff.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = (xml.get("//xmlns:staff", this.freshbooks.ns) || xml.get("//xmlns:member", this.freshbooks.ns)).childNodes();
  
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
 * Gets Current Staff Member
 * 
 * @param {Number} id
 * @param {Function} fn
 * @api public
 */
 
Staff.prototype.current = function(fn) {
  var self = this;

  this._setXML("staff.current", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET CURRENT STAFF: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Gets a Staff Member.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Staff.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.staff_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("staff.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET STAFF: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * List Staff.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Staff.prototype.list = function(fn) {
  var self = this
    , options = [];
  
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("staff.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST STAFF: " + err));
      } else {
        var members = xml.get("//xmlns:staff_members", self.freshbooks.ns)
          , options = { page: members.attr("page").value()
                      , per_page: members.attr("per_page").value()
                      , pages: members.attr("pages").value()
                      , total: members.attr("total").value() }
            members = [];
            
        xml.find("//xmlns:member", self.freshbooks.ns).forEach(function(a) {
          var member = new self.freshbooks.Staff();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          member._getXML(xml, function() {
            members.push(member);
          });
        });
        
        fn(null, members, options);
      }
    });
  });
};