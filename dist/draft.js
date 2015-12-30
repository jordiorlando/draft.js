/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* draft.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Wed Dec 30 2015 06:27:38 GMT-0600 (CST)
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
    root.Draft = factory(root, root.document);
  }
}(typeof window !== "undefined" ? window : this, function (window, document) {
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

Draft.defaults = {
  system: 'cartesian',
  units: 'px',
  /*width: 0,
  length: 0,
  r: 0, // radius
  a: 0, // angle*/

  // Cartesian coordinates
  cartesian: {
    layer: 1,
    vars: [
      'x',
      'y',
      'z'
    ],
    web: [
      function (pos) {
        return pos[0];
      },
      function (pos) {
        return height - pos[1];
      },
      function (pos) {
        return pos[2];
      },
      // Full position
      function (pos) {
        return [
          pos[0],
          height - pos[1],
          pos[2]
        ];
      }
    ],
    polar: [
      function (pos) {
        return Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2));
      },
      function (pos) {
        return Math.atan2(pos[1], pos[0]);
      },
      function (pos) {
        return pos[2];
      },
      // Full position
      function (pos) {
        return [
          Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2)),
          Math.atan2(pos[1], pos[0]),
          pos[2]
        ];
      }
    ],
    origin: {
      x: 0,
      y: 'height'
    }
  },

  // Polar/Cylindrical coordinates
  polar: {
    layer: 2,
    vars: [
      'rho',
      'phi',
      'z'
    ],
    cartesian: [
      function (pos) {
        return pos[0] * Math.cos(pos[1] * (Math.PI / 180));
      },
      function (pos) {
        return pos[0] * Math.sin(pos[1] * (Math.PI / 180));
      },
      function (pos) {
        return pos[2];
      }
    ],
    origin: {
      x: 'width/2',
      y: 'height/2'
    }
  },

  // Spherical coordinates
  spherical: {
    layer: 2,
    vars: [
      'rho',
      'phi',
      'theta'
    ]
  }
};

// Pad a number with zeroes until the number of digits is equal to length
function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

// Get the parent doc of an element
function elementDoc(element) {
  return elementType(element.parent) == 'doc' ?
    element.parent : elementDoc(element.parent);
}

// Get the type of an element
function elementType(element) {
  for (var e in Draft) {
    if (element.constructor == Draft[e]) {
      return e.toLowerCase();
    }
  }
}

// Get a unique ID based on the number of instances of a type of element
function elementID(element) {
  return elementDoc(element).elements[elementType(element)].length;
}

function updateDOM(element) {
  if (element.dom && element.dom.treeView) {
    element.updateTreeView();
  }
  if (element.parent) {
    updateDOM(element.parent);
  }
}

Draft.json = {
  stringify: function (replacer) {
    return JSON.stringify(this, replacer, 2);
  }
};

Draft.prop = {
  prop: function (prop, val) {
    // Make sure this.properties is initialized
    this.properties = this.properties || {};

    // Act as a full properties getter if prop is null/undefined
    if (prop == null) {
      prop = {};

      for (let p in this.properties) {
        prop[p] = this.properties[p];
      }

      return prop;
    }
    // Act as a getter if prop is an object with only null values.
    // Act as a setter if prop is an object with at least one non-null value.
    else if (typeof prop === 'object') {
      let setter = false;

      for (let p in prop) {
        // Get this.properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter |= typeof prop[p] === 'object';
      }

      return setter ? this : prop;
    }
    // Delete the property if val is null
    else if (val === null) {
      delete this.properties[prop];
    }
    // Act as an individual property getter if val is undefined
    else if (val === undefined) {
      /*val = this.properties[prop];
      return val === undefined ? Draft.defaults[prop] || 0 : val;*/

      // If prop is undefined, set it to the default OR 0
      return this.properties[prop] ||
        this.prop(prop, Draft.defaults[prop] || 0);
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      this.properties[prop] = val;
    }

    updateDOM(this);

    // prop() is chainable if 'this' is returned
    return this;
  }
};

Draft.system = {
  require: [
    Draft.prop
  ],

  // Cartesian:
  // - page.system('cartesian')
  // - (x, y)
  // - x is right, y is up, z is out of the page (right-hand)
  // - global origin (0, 0) is at bottom-left
  //
  // Polar:
  // - page.system('polar')
  // - (r, phi)
  // - phi is counter-clockwise, with 0 pointing to the right
  // - global pole (0, 0) is at center
  //
  // TODO: remove this?
  // Web/SVG:
  // - page.system('web')
  // - (x, y)
  // - x is right, y is down, z is out of the page (left-hand)
  // - global origin (0, 0) is at top-left

  // TODO: switch phi for theta?
  // TODO: Spherical (p, theta, phi), Cylindrical (p, phi, z)
  system: function (system) {
    /*if (this.prop('system') != system) {
      // TODO: recursively convert all elements to new system?
    }*/
    return this.prop('system', system);
  }
};

Draft.units = {
  require: [
    Draft.prop
  ],

  // Get/set the element's measurement units
  units: function (units) {
    return this.prop('units', units);
  }
};

Draft.size = {
  require: [
    Draft.prop
  ],

  // Get/set the element's width
  width: function (width) {
    return this.prop('width', width);
  },
  // Get/set the element's height
  height: function (height) {
    return this.prop('height', height);
  },
  // Get/set the element's width & height
  size: function (width, height) {
    return this.prop({
      width: width,
      height: height
    });
  }
};

Draft.move = {
  require: [
    Draft.prop
  ],
  /*// Get/set the element's x position
  x: function (x) {
    return this.prop('x', x);
  },

  // Get/set the element's y position
  y: function (y) {
    return this.prop('y', y);
  },*/

  // Get/set the element's position
  move: function () {
    var pos = {};
    for (var i = 0; i < arguments.length; i++) {
      pos[Draft.defaults[this.prop('system')].vars[i]] = arguments[i];
    }
    return this.prop(pos);
  }
};

Draft.radius = {
  require: [
    Draft.prop
  ],
  // Get/set the element's x radius
  rx: function (rx) {
    return this.prop('rx', rx);
  },
  // Get/set the element's y radius
  ry: function (ry) {
    return this.prop('ry', ry);
  },
  // Get/set the element's radius
  radius: function (rx, ry) {
    return this.prop({
      rx: rx,
      ry: ry
    });
  }
};

Draft.transform = {
  require: [
    Draft.prop
  ],
  transform: function (obj) {
    // TODO: make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] == null ?
        obj[k] : this.prop(k) + obj[k];
    }

    return this.prop(obj);
  }
};

Draft.transforms = {
  require: [
    Draft.transform
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

Draft.Container = Draft.create({
  // TODO: inherit from Draft.Element?
  require: [
    Draft.prop
  ],

  methods: {
    parent: function () {
      return this.parent;
    },
    child: function (child) {
      return this.children[child];
    },
    push: function (element) {
      // Add a reference to the element's parent
      element.parent = this;

      // Initialize children array and add the element to the end
      this.children = this.children || [];
      this.children.push(element);

      // Add the element to its type array
      var doc = elementDoc(element);
      var type = elementType(element);
      doc.elements = doc.elements || {};
      doc.elements[type] = doc.elements[type] || [];
      doc.elements[type].push(element);

      // Set the element's basic properties
      element.prop({
        type: type,
        id: elementID(element)
      });

      return element;
    },
    // FIXME: figure out why this only updates the tree view when saved to a var
    add: function (element) {
      return this.push(element);
    }
  }
});

Draft.Doc = Draft.create({
  construct: function (element) {
    if (element) {
      // Ensure the presence of a DOM element
      this.dom = typeof element == 'string' ?
        document.getElementById(element) :
        element;
    }
  },

  inherit: Draft.Container

  /*methods: {
    docs: function () {
      return this.node.docs;
    }
  }*/

  /*init: {
    doc: function (element, name) {
      if (element) {
        // Ensure the presence of a DOM element
        element = typeof element == 'string' ?
          document.getElementById(element) :
          element;

        var doc = new Draft.Doc(name);

        // this.node = {};
        doc.children = [];
        doc.dom = element;

        return doc;
      }

      // this.constructor.call(this, element);
    }
  }*/
});

Draft.Group = Draft.create({
  inherit: Draft.Container,

  require: [
    Draft.system,
    Draft.units
  ],

  init: {
    group: function (name) {
      // TODO: move this .prop call somewhere else?
      return this.add(new Draft.Group(name)).prop({
        system: this.system(),
        units: this.units()
      }).move(0, 0);
    }
  }
});

Draft.Page = Draft.create({
  inherit: Draft.Group,

  require: [
    Draft.size
  ],

  methods: {
    // Set the page's origin relative to its (0, 0) position
    // TODO: remove this?
    origin: function (x, y) {
      return this.prop({
        'origin.x': x,
        'origin.y': y
      });
    }
  },

  init: {
    page: function (name) {
      // TODO: move this .prop call somewhere else?
      return this.add(new Draft.Page(name)).prop({
        system: Draft.defaults.system,
        units: Draft.defaults.units
      });

      // Draft.pages.push(page);
    }
  },

  parent: Draft.Doc
});

Draft.Element = Draft.create({
  require: [
    Draft.size,
    Draft.move
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});

Draft.Line = Draft.create({
  inherit: Draft.Element,

  methods: {
  },

  init: {
    line: function (x1, y1, x2, y2) {
      return this.add(new Draft.Line());
    }
  }
});

Draft.Rect = Draft.create({
  inherit: Draft.Element,

  require: [
    Draft.radius
  ],

  methods: {
    // in the butt
    getRekt: function () {
      return this.prop();
    }
  },

  init: {
    rect: function (width, height) {
      return this.add(new Draft.Rect()).size(width, height);
    }
  }
});

Draft.Circle = Draft.create({
  inherit: Draft.Element,

  require: [
    /*Draft.radius*/
  ],

  methods: {
    radius: function (r) {
      return this.prop('r', r);
    }
  },

  init: {
    circle: function (r) {
      return this.add(new Draft.Circle()).radius(r);
    }
  }
});

  return Draft;
}));