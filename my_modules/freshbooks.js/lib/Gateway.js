var libxml = require('libxmljs');

/**
 * Creates a new Gateway.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Gateway}
 * @api public
 */
 
var Gateway = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Gateway.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for gateway.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  switch(method) {
    case "gateway.list":
      for(var key in options) {
        if("function" !== typeof options[key]) {
          request.node(key).text(options[key]);  
        }
      } 
    break;
  }

  fn(xml);
};

/**
 * Sets Gateway properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Gateway.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:gateway", this.freshbooks.ns).childNodes();
  
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
 * List Gateways.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Gateway.prototype.list = function(fn) {
  var self = this
    , options = [];
  
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("gateway.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST GATEWAYS: " + err));
      } else {
        var gateways = xml.get("//xmlns:gateways", self.freshbooks.ns)
          , options = { page: gateways.attr("page").value()
                      , per_page: gateways.attr("per_page").value()
                      , pages: gateways.attr("pages").value()
                      , total: gateways.attr("total").value() }
            gateways = [];
            
        xml.find("//xmlns:gateway", self.freshbooks.ns).forEach(function(a) {
          var gateway = new self.freshbooks.Gateway();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          gateway._getXML(xml, function() {
            gateways.push(gateway);
          });
        });
        
        fn(null, gateways, options);
      }
    });
  });
};