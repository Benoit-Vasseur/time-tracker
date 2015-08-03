var libxml = require('libxmljs');

/**
 * Creates a new Project.
 * 
 * @param {FreshBooks} FreshBooks
 * @return {Project}
 * @api public
 */
 
var Project = module.exports = function() {
  this.staff = []
, this.tasks = [];
};

/**
 * Constructs XML requests for the API depending on method.
 * 
 * @param {String} method
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api private
 */
 
Project.prototype._setXML = function(method, fn) {
  var xml = new libxml.Document()
    , request = xml.node("request").attr("method", method)
    , options
    , self = this;
    
  //If second argument not a function then we have been passed the 'options' for project.list
  if("function" === typeof arguments[2]) {
    options = arguments[1];
    fn = arguments[2];
  }
  
  switch(method) {
    case "project.create":
    case "project.update":
      var project = request.node("project");
        
      for(var key in this) {
        if("function" !== typeof this[key]) {
          
          switch(key) {
            //Catch resulting values that can't be created/updated.
            case "staff":
            case "budget":
            case "freshbooks":
            break;
            
            case "tasks":
              if(this.tasks.length > 0) {
                var tasks = request.node("tasks");
              
                this.tasks.forEach(function(a) {
                  var task = tasks.node("task");
                
                  for(var key in a) {
                    task.node(key).text(a[key]);
                  }
                });
              }
            break;
            break;
            
            default:
              project.node(key).text(this[key]);  
            break;
          }
        }
      }
    break;
      
    case "project.get":
    case "project.delete":    
      request.node("project_id").text(self.project_id);
    break;
    
    case "project.list":
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
 * Sets Project properties from results of XML request.
 * 
 * @param {Document} xml
 * @param {Function} fn
 * @api private
 */
 
Project.prototype._getXML = function(xml, fn) {
  var self = this
    , nodes = xml.get("//xmlns:project", this.freshbooks.ns).childNodes();
  
  for(var x=0; x < nodes.length; x++) {
    if("text" !== nodes[x].name()) {
      switch(nodes[x].name()) {
        case "tasks":
          xml.find("//xmlns:task",this.freshbooks.ns).forEach(function(a) {
            var task = {}
              , a = a.childNodes();

            for(var y=0; y < a.length; y++) {
              if("text" !== a[y].name()) {
                task[a[y].name()] = a[y].text();
              }
            }
            self.tasks.push(task);
          });
        break;
        
        case "staff":
          xml.find("//xmlns:line",this.freshbooks.ns).forEach(function(a) {
            var staff = {}
              , a = a.childNodes();

            for(var y=0; y < a.length; y++) {
              if("text" !== a[y].name()) {
                staff[a[y].name()] = a[y].text();
              }
            }
            self.staff.push(staff);
          });
        break;
        
        default:
          this[nodes[x].name()] = nodes[x].text();
        break;
      }
    }
  }
  fn();
};

/**
 * Creates an Project.
 * 
 * @param {Function} fn
 * @api public
 */
 
Project.prototype.create = function(fn) {
  var self = this;
  
  this._setXML("project.create", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT CREATE PROJECT: " + err));
      } else {
        self.project_id = xml.get("//xmlns:project_id", self.freshbooks.ns).text();
        self.get(self.project_id, fn);
      }
    });
  });
};

/**
 * Updates an Project.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Project.prototype.update = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.project_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("project.update", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT UPDATE PROJECT: " + err));
      } else {
        self.get(self.project_id, fn);
      }
    });
  });
};

/**
 * Gets an Project.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Project.prototype.get = function(fn) {
  var self = this;

  if("function" === typeof arguments[1]) {
    this.project_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("project.get", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT GET PROJECT: " + err));
      } else {
        self._getXML(xml, function() {
          fn(null, self);
        });
      }
    });
  });
};

/**
 * Deletes an Project.
 * 
 * @param {Number} id (optional)
 * @param {Function} fn
 * @api public
 */
 
Project.prototype.delete = function(fn) {
  var self = this;
  
  if("function" === typeof arguments[1]) {
    this.project_id = arguments[0];
    fn = arguments[1];
  }
  
  this._setXML("project.delete", function(xml) {
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT DELETE PROJECT: " + err));
      } else {
        fn();
      }
    });
  });
};

/**
 * List Projects.
 * 
 * @param {Array} options (optional)
 * @param {Function} fn
 * @api public
 */
 
Project.prototype.list = function(fn) {
  var self = this
    , options = [];
    
  if("function" === typeof arguments[1]) {
    options = arguments[0];
    fn = arguments[1];
  }
    
  this._setXML("project.list", options, function(xml) {
    
    self.freshbooks._get(xml, function(err, xml) {
      if(null !== err) {
        fn(err);
      } else if("ok" !== xml.get("//xmlns:response",self.freshbooks.ns).attr("status").value()) {
        err = xml.get("//xmlns:error",self.freshbooks.ns).text();
        fn(new Error("CANNOT LIST PROJECTS: " + err));
      } else {
        var projects = xml.get("//xmlns:projects", self.freshbooks.ns)
          , options = { page: projects.attr("page").value()
                      , per_page: projects.attr("per_page").value()
                      , pages: projects.attr("pages").value()
                      , total: projects.attr("total").value() }
            projects = [];
            
        xml.find("//xmlns:project", self.freshbooks.ns).forEach(function(a) {
          var project = new self.freshbooks.Project();
          xml = libxml.parseXmlString('<?xml version="1.0" encoding="UTF-8"?>' + '<response xmlns="http://www.freshbooks.com/api/" status="ok">' + a.toString() + '</response>');
          project._getXML(xml, function() {
            projects.push(project);
          });
        });
        
        fn(null, projects, options);
      }
    });
  });
};