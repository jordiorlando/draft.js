/*
* draw.js - A lightweight library for parametric drawing
* version v0.0.0
* draw.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Mon Dec 21 2015 05:03:15 GMT-0600 (CST)
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

function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

Draw.attr = {
  attr: function (prop, val) {
    if (this.params == null) {
      this.params = {};
    }

    if (prop == null) {
      /*console.log('attr(' + prop + ',' + val + ')->this: ');
      console.log(this);*/

      prop = {};

      for (let p in this.params) {
        prop[p] = this.params[p];
      }

      return prop;
    } else if (typeof prop === 'object') {
      let getter = true;

      for (let p in prop) {
        prop[p] = this.attr(p, prop[p]);
        if (typeof prop[p] === 'object') {
          getter = false;
        }
      }
      if (getter) {
        return prop;
      }
    } else if (val == null) {
      val = this.params[prop];
      return val == null ?
        Draw.defaults[prop] : val;
    } else {
      /*console.log(prop + ', ' + val);
      console.log(this.params);*/
      this.params[prop] = val;
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
  methods: {
    parent: function () {
      return this.parent;
    },
    child: function (i) {
      return this.children[i];
    },
    put: function (element) {
      element.parent = this;

      if (this.children == null) {
        this.children = [];
      }
      this.children.push(element);

      return element;
    }
  }
});

Draw.Doc = Draw.create({
  construct: function (element) {
    if (element) {
      // Ensure the presence of a DOM element
      element = typeof element == 'string' ?
                document.getElementById(element) :
                element;

      // this.node = {};
      this.children = [];
      this.dom = element;
    }
  },

  inherit: Draw.Container,

  /*methods: {
    docs: function () {
      return this.node.docs;
    }
  }*/

  init: {
    doc: function (element) {
      this.constructor.call(this, element);
    }
  }
});

Draw.Group = Draw.create({
  inherit: Draw.Container,

  require: [
    Draw.attr
  ],

  init: {
    group: function (name) {
      return this
        .put(new Draw.Group())
        .attr({
          type: 'group',
          name: name
        });
    }
  }
});

Draw.Page = Draw.create({
  inherit: Draw.Group,

  require: [
    Draw.size
  ],

  methods: {
    origin: function (x, y) {
      // TODO: change to origin.x and origin.y?
      return this.attr({
        originX: x,
        originY: y
      });
    }
  },

  init: {
    page: function (name) {
      return this
        .put(new Draw.Page())
        .attr({
          type: 'page',
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

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});

Draw.Line = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move
  ],

  methods: {
  },

  init: {
    line: function (x1, y1, x2, y2) {
      return new Draw.Line();
    }
  }
});

Draw.Rect = Draw.create({
  name: 'rect',

  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  methods: {
    // in the butt
    getRekt: function () {
      return this.attr();
    }
  },

  init: {
    rect: function (width, height) {
      return this.put(new Draw.Rect()).size(width, height);
    }
  }
});

Draw.Circle = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  init: {
    circle: function (r) {
      return this.put(new Draw.Circle()).radius(r);
    }
  }
});


  return Draw;
}));