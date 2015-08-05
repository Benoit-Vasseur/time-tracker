var libxml = require('libxmljs');

/**
 * Creates a new Payment.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Payment}
 * @api public
 */
 
var Payment = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Payment.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for payment.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  if(method == "payment.create" || method == "payment.update") 
    var payment = request.node("payment");
    
  switch(method) {
    case "payment.create":
      if(this.client_id)
        payment.node("client_id").text(this.client_id);
      if(this.invoice_id)
        payment.node("invoice_id").text(this.invoice_id);
        
    case "payment.update":    
      for(var key in this) {
        if("function" !== typeof this[key]) {
          
          switch(key) {
            //Catch resulting values that can't be created/updated.
            case "freshbooks":
            case "updated":
            case "from_credit":
            case "client_id":
            case "invoice_id":
            break;
            
            default:
              payment.node(key).text(this[key]);  
            break;
          }
        }
      }
    break;
      
    case "payment.get":
    case "payment.delete":    
      request.node("payment_id").text(self.payment_id);
    break;
    
    case "payment.list":
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
 * Sets Payment properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Payment.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:payment", this.freshbooks.ns).childNodes();
  
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
 * Creates an Payment.
 * 
 * @param {Function} fn
 * @api public
 */
 
Payment.prototype.create = function(fn) {
  var self = this;
  
  this._setXML("payment.create", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT CREATE PAYMENT: " + err));
      } else {
        self.payment_id = xml.get("//xmlns:payment_id", self.freshbooks.ns).text();
        self.get(self.payment_id, fn);
      }
    });
  });
};

/**
 * Updates an Payment.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Payment.prototype.update = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.payment_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("payment.update", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT UPDATE PAYMENT: " + err));
      } else {
        self.get(self.payment_id, fn);
      }
    });
  });
};

/**
 * Gets an Payment.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Payment.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.payment_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("payment.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET PAYMENT: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Deletes an Payment.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Payment.prototype.delete = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.payment_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("payment.delete", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT DELETE PAYMENT: " + err));
      } else {
        fn();
      }
    });
  });
};

/**
 * List Payments.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Payment.prototype.list = function(fn) {
  var self = this
    , options = [];
    
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
    
  this._setXML("payment.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST PAYMENTS: " + err));
      } else {
        var payments = xml.get("//xmlns:payments", self.freshbooks.ns)
          , options = { page: payments.attr("page").value()
                      , per_page: payments.attr("per_page").value()
                      , pages: payments.attr("pages").value()
                      , total: payments.attr("total").value() }
            payments = [];
            
        xml.find("//xmlns:payment", self.freshbooks.ns).forEach(function(a) {
          var payment = new self.freshbooks.Payment();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          payment._getXML(xml, function() {
            payments.push(payment);
          });
        });
        
        fn(null, payments, options);
      }
    });
  });
};