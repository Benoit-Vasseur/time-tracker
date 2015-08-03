var libxml = require('libxmljs');

/**
 * Creates a new Task.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Task}
 * @api public
 */
 
var Task = module.exports = function() {

};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Task.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for task.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  switch(method) {
    case "task.create":
    case "task.update":
      var task = request.node("task");
        
      for(var key in this) {
        if("function" !== typeof this[key]) {
          
          switch(key) {
            //Catch resulting values that can't be created/updated.
            case "freshbooks":
            break;
            
            default:
              task.node(key).text(this[key]);  
            break;
          }
        }
      }
    break;
      
    case "task.get":
    case "task.delete":    
      request.node("task_id").text(self.task_id);
    break;
    
    case "task.list":
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
 * Sets Task properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Task.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:task", this.freshbooks.ns).childNodes();
  
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
 * Creates an Task.
 * 
 * @param {Function} fn
 * @api public
 */
 
Task.prototype.create = function(fn) {
  var self = this;
  
  this._setXML("task.create", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT CREATE TASK: " + err));
      } else {
        self.task_id = xml.get("//xmlns:task_id", self.freshbooks.ns).text();
        self.get(self.task_id, fn);
      }
    });
  });
};

/**
 * Updates an Task.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Task.prototype.update = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.task_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("task.update", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT UPDATE TASK: " + err));
      } else {
        self.get(self.task_id, fn);
      }
    });
  });
};

/**
 * Gets an Task.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Task.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.task_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("task.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET TASK: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Deletes an Task.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Task.prototype.delete = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.task_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("task.delete", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT DELETE TASK: " + err));
      } else {
        fn();
      }
    });
  });
};

/**
 * List Tasks.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Task.prototype.list = function(fn) {
  var self = this
    , options = [];
    
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
    
  this._setXML("task.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST TASKS: " + err));
      } else {
        var tasks = xml.get("//xmlns:tasks", self.freshbooks.ns)
          , options = { page: tasks.attr("page").value()
                      , per_page: tasks.attr("per_page").value()
                      , pages: tasks.attr("pages").value()
                      , total: tasks.attr("total").value() }
            tasks = [];
            
        xml.find("//xmlns:task", self.freshbooks.ns).forEach(function(a) {
          var task = new self.freshbooks.Task();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          task._getXML(xml, function() {
            tasks.push(task);
          });
        });
        
        fn(null, tasks, options);
      }
    });
  });
};