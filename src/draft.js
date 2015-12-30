var Draft = this.Draft = function (element) {
  return new Draft.Doc(element);
};

// TODO: separate ID counters for each type of element
Draft.id = 0;
// TODO: separate array containers for each type of element
// Draft.pages = [];

// This function takes an existing element and copies the supplied methods to it
Draft.extend = function (element, methods) {
  for (var method in methods) {
    // If method is a function, copy it
    if (typeof methods[method] === 'function') {
      element.prototype[method] = methods[method];
    }
    // If method is an array, call Draft.extend for each element of the array
    else if (method == 'require') {
      methods[method].forEach(function (e) {
        Draft.extend(element, e);
      });
    }
  }

  return methods;
};

// This function creates a new element class from a configuration object
Draft.create = function (config) {
  var element = typeof config.construct == 'function' ?
    config.construct :
    function (name) {
      // TODO: change this?
      this.prop({
        name: name || null
      });
      // this.constructor.call(this);
    };

  // Inherit the prototype
  if (config.inherit) {
    element.prototype = Object.create(config.inherit.prototype);
    element.prototype.constructor = element;
  }

  // var methods = {};

  // Attach all required methods
  if (config.require) {
    config.require.forEach(function (e) {
      Draft.extend(element, e);
    });
  }

  // Attach all new methods
  if (config.methods) {
    Draft.extend(element, config.methods);
  }

  // Attach the initialization method to the parent
  if (config.init) {
    Draft.extend(config.parent || Draft.Container, config.init);
  }

  // Construct a unique ID from the element's type and ID
  Draft.domID = function (element) {
    return 'DraftJS_' +
      element.properties.type + '_' +
      zeroPad(element.properties.id, 4);
  };

  return element;
};
