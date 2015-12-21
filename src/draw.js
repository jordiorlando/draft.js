var Draw = this.Draw = function (element) {
  return new Draw.Doc(element);
};

Draw.id = 0;
// Draw.pages = [];

Draw.extend = function (element, methods) {
  for (var method in methods) {
    // If method is a function, copy it
    if (typeof methods[method] === 'function') {
      element.prototype[method] = methods[method];
    }
    // If methods is an array, call Draw.extend for each element of the array
    else if (method == 'require') {
      /*console.log(methods);
      console.log(methods[method]);*/
      methods[method].forEach(function (e) {
        Draw.extend.call(element, e);
      });
    }
  }
};

Draw.create = function (config) {
  var element = typeof config.construct == 'function' ?
    config.construct :
    function () {
      this.attr('id', zeroPad(Draw.id++, 4));
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
