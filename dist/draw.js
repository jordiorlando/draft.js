/*
* draw.js - A lightweight library for parametric drawing
* version v0.0.0
* draw.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Sun Dec 20 2015 21:25:08 GMT-0600 (Central Standard Time)
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return factory(root, root.document);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS.
    module.exports = root.document ? factory(root, root.document) :
      function (w) {
        return factory(w, w.document);
      };
  } else {
    // Browser globals (root is window)
    root.Draw = factory(root, root.document);
  }
}(typeof window !== "undefined" ? window : this, function (window, document) {

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

Draw.defaults = {
  x: 0,
  y: 0,
  width: 0,
  length: 0,
  originX: 0,
  originY: 0,
  r: 0,
  a: 0
};

Draw.attr = {
  attr: function (key, val) {
    if (key == null) {
      key = {};

      for (let k in this.attr) {
        key[k] = this.attr[k];
      }

      return key;
    } else if (typeof key === 'object') {
      let getter = true;

      for (let k in key) {
        key[k] = this.attr(k, key[k]);
        if (typeof key[k] === 'object') {
          getter = false;
        }
      }
      if (getter) {
        return key;
      }
    } else if (val == null) {
      val = this.attr[key];
      return val == null
        ? Draw.defaults[key]
        : val;
    } else {
      this.attr[key] = val;
    }

    return this;
  }
};

Draw.size = {
  require: [
    Draw.attr
  ],
  
  // Get/set the element's width
  width: function (width) {
    return this.attr('width', width);
  },
  // Get/set the element's height
  height: function (height) {
    return this.attr('height', height);
  },
  // Get/set the element's width & height
  size: function (width, height) {
    return this.attr({
      width: width,
      height: height
    });
  }
};

Draw.move = {
  require: [
    Draw.attr
  ],
  // Get/set the element's x position
  x: function (x) {
    return this.attr('x', x);
  },

  // Get/set the element's y position
  y: function (y) {
    return this.attr('y', y);
  },

  // Get/set the element's position
  move: function (x, y) {
    return this.attr({
      x: x,
      y: y
    });
  }
};

Draw.radius = {
  require: [
    Draw.attr
  ],
  // Get/set the element's x radius
  rx: function (rx) {
    return this.attr('rx', rx);
  },
  // Get/set the element's y radius
  ry: function (ry) {
    return this.attr('ry', ry);
  },
  // Get/set the element's radius
  radius: function (rx, xy) {
    return this.attr({
      rx: rx,
      ry: ry
    });
  }
};

Draw.transform = {
  require: [
    Draw.attr
  ],
  transform: function (obj) {
    // TODO: make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] == null ?
        obj[k] : this.attr(k) + obj[k];
    }

    return this.attr(obj);
  }
};

Draw.transforms = {
  require: [
    Draw.transform
  ],
  // Translate the element relative to its current position
  translate: function (x, y) {
    return this.transform({
      x: x,
      y: y
    });
  },
  // Scale the element relative to its current size
  scale: function (x, y, cx, cy) {
    /*return this.transform({
      x: x,
      y: y,
      cx: cx,
      cy: cy
    });*/
  },
  // Rotate the element relative to its current angle
  rotate: function (a, cx, cy) {
    /*return this.transform({
      a: a,
      cx: cx,
      cy: cy
    });*/
  },
  // Skew the element relative to its current skew
  skew: function (ax, ay, cx, cy) {
    /*return this.transform({
      ax: ax,
      ay: ay,
      cx: cx,
      cy: cy
    });*/
  }
};

Draw.Container = Draw.create({
  extend: {
    parent: function () {
      return this.node.parent;
    },
    child: function (i) {
      return this.node.children[i];
    },
    children: function () {
      return this.node.children;
    },
    put: function (element) {
      // element.node.parent = this;
      // this.node.children.push(element);
      return element;
    }
  }
});

Draw.Doc = Draw.create({
  create: function (element) {
    if (element) {
      // Ensure the presence of a DOM element
      element = typeof element == 'string' ?
                document.getElementById(element) :
                element;

      this.node = element;
    }
  },

  inherit: Draw.Container,

  extend: {
    /*docs: function () {
      return this.node.docs;
    }*/
  }

  /*construct: {
    doc: function (element) {
      var doc = new Draw.Doc();

      if (element) {
        // Ensure the presence of a DOM element
        element = typeof element == 'string' ?
                  document.getElementById(element) :
                  element;

        doc.node = element;
      }

      return doc;
    }
  }*/
});

Draw.Group = Draw.create({
  inherit: Draw.Container
});

Draw.Page = Draw.create({
  inherit: Draw.Group,

  extend: {
    origin: function (x, y) {
      // TODO: change to origin.x and origin.y?
      return this.attr({
        originX: x,
        originY: y
      });
    }
  },

  construct: {
    page: function (name) {
      return this
        .put(new Draw.Page())
        .attr({
          type: 'page',
          id: Draw.id++,
          name: name
        });

      // Draw.pages.push(page);
      // return page;
    }
  }
});

Draw.Element = Draw.create({
  require: [
    Draw.attr,
    Draw.size
  ],

  extend: {
    parent: function () {
      return this.node.parent;
    }
  }
});

Draw.Line = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move
  ],

  extend: {
  },

  construct: {
    line: function (x1, y1, x2, y2) {
      return new Draw.Line();
    }
  }
});


  return Draw;
}));