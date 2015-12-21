var Draw = this.Draw = function (element) {
  return new Draw.Doc(element);
};

Draw.id = 1000;
Draw.pages = [];

Draw.extend = function (module, methods) {
  for (var method in methods) {
    // If method is a function, copy it
    if (typeof methods[method] === 'function') {
      module.prototype[method] = methods[method];
    }
    // If methods is an array, call Draw.extend for each element of the array
    else if (method == 'require') {
      methods[method].forEach(function (element) {
        Draw.extend.call(this, element);
      });
    }
  }
};

Draw.create = function (config) {
  var creation = typeof config.create == 'function' ?
    config.create :
    function () {
      // this.constructor.call(this);
    };

  // Inherit the prototype
  if (config.inherit) {
    console.log(config.inherit);
    creation.prototype = new config.inherit;
  }

  // Attach all required methods
  if (config.require) {
    config.require.forEach(function (element) {
      Draw.extend(creation, element);
    });
  }

  // Attach all new methods
  if (config.extend) {
    Draw.extend(creation, config.extend);
  }

  // Attach the constructor method to the parent
  if (config.construct) {
    Draw.extend(config.parent || Draw.Container, config.construct);
  }

  return creation;
};



/*function (element) {
  if (element) {
    // Ensure the presence of a dom element
    element = typeof element == 'string' ?
              document.getElementById(element) :
              element;

    element.node = element
    return element;
  }
};*/
