var Draw = this.Draw = function (element) {
  return new Draw.Doc(element);
};

// TODO: separate ID counters for each type of element
Draw.id = 0;
// TODO: separate array containers for each type of element
// Draw.pages = [];

// This function takes an existing element and copies the supplied methods to it
Draw.extend = function (element, methods) {
  for (var method in methods) {
    // If method is a function, copy it
    if (typeof methods[method] === 'function') {
      element.prototype[method] = methods[method];
    }
    // If method is an array, call Draw.extend for each element of the array
    else if (method == 'require') {
      methods[method].forEach(function (e) {
        Draw.extend.call(element, e);
      });
    }
  }
};

// This function creates a new element class from a configuration object
Draw.create = function (config) {
  var element = typeof config.construct == 'function' ?
    config.construct :
    function (name) {
      this.prop({
        id: zeroPad(++Draw.id, 4),
        name: name,
        type: elementType(this)
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
      Draw.extend(element, e);
    });
  }

  // Attach all new methods
  if (config.methods) {
    Draw.extend(element, config.methods);
  }

  // Attach the initialization method to the parent
  if (config.init) {
    Draw.extend(config.parent || Draw.Container, config.init);
  }

  return element;
};
