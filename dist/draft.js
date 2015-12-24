/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* draft.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Wed Dec 23 2015 19:08:30 GMT-0600 (CST)
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
      this.prop({
        id: zeroPad(++Draft.id, 4),
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

  return element;
};

Draft.defaults = {
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

function elementType(element) {
  for (var e in Draft) {
    if (element.constructor == Draft[e]) {
      return e.toLowerCase();
    }
  }
}

function elementID(element) {
  return Draft.prop.prop.call(element, 'type') +
    Draft.prop.prop.call(element, 'id');
}

function updateDOM(element) {
  if (element.dom) {
    if (element.dom.tree) {
      element.updateTree();
    }
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

Draft.tree = {
  require: [
    Draft.json
  ],

  createTree: function () {
    var tree = document.createElement('div');
    tree.className = 'element-tree';

    // tree.appendChild(document.createElement('span'));
    // tree.firstChild.textContent = 'Document Model:';

    var pre = document.createElement('pre');
    tree.appendChild(pre);

    // Make sure this.dom is initialized
    this.dom = this.dom || {};
    this.dom.tree = tree;

    return this.updateTree();
  },

  updateTree: function () {
    var replacer = function (key, value) {
      if (key == "dom" || key == "parent" || key == "id" || key == "type") {
        return undefined;
      } else if (key == "children") {
        var obj = {};
        value.forEach(function (element) {
          obj[elementID(element)] = element;
        });
        return obj;
      }
      return value;
    };

    var treeString = this.stringify(replacer).split('"').join('');
    this.dom.tree.firstChild.textContent = elementID(this) + ': ' + treeString;

    var longestLine = treeString.split('\n').reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });
    // FIXME: change 84 to a non-hardcoded value
    this.dom.tree.style.width = Math.min(longestLine.length + 4, 84) + 'ch';

    return this.dom.tree;
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
    // Act as an individual property getter if val is null/undefined
    else if (val == null) {
      val = this.properties[prop];
      return val == null ? Draft.defaults[prop] : val;
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
  // Get/set the element's x position
  x: function (x) {
    return this.prop('x', x);
  },

  // Get/set the element's y position
  y: function (y) {
    return this.prop('y', y);
  },

  // Get/set the element's position
  move: function (x, y) {
    return this.prop({
      x: x,
      y: y
    });
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
  require: [
    // TODO: make Draft.tree into a separate plugin
    Draft.tree
  ],

  methods: {
    parent: function () {
      return this.parent;
    },
    child: function (i) {
      return this.children[i];
    },
    put: function (element) {
      element.parent = this;

      this.children = this.children || [];
      this.children.push(element);

      return element;
    }
  }
});

Draft.Doc = Draft.create({
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

  inherit: Draft.Container,

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

Draft.Group = Draft.create({
  inherit: Draft.Container,

  require: [
    Draft.prop
  ],

  init: {
    group: function (name) {
      return this.put(new Draft.Group(name));
    }
  }
});

Draft.Page = Draft.create({
  inherit: Draft.Group,

  require: [
    Draft.size
  ],

  methods: {
    origin: function (x, y) {
      // TODO: change to origin.x and origin.y?
      return this.prop({
        originX: x,
        originY: y
      });
    }
  },

  init: {
    page: function (name) {
      return this.put(new Draft.Page(name));

      // Draft.pages.push(page);
    }
  }
});

Draft.Element = Draft.create({
  require: [
    Draft.prop,
    Draft.size
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});

Draft.Line = Draft.create({
  inherit: Draft.Element,

  require: [
    Draft.move
  ],

  methods: {
  },

  init: {
    line: function (x1, y1, x2, y2) {
      return new Draft.Line();
    }
  }
});

Draft.Rect = Draft.create({
  inherit: Draft.Element,

  require: [
    Draft.move,
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
      return this.put(new Draft.Rect()).size(width, height);
    }
  }
});

Draft.Circle = Draft.create({
  inherit: Draft.Element,

  require: [
    Draft.move/*,
    Draft.radius*/
  ],

  methods: {
    radius: function (r) {
      return this.prop('r', r);
    }
  },

  init: {
    circle: function (r) {
      return this.put(new Draft.Circle()).radius(r);
    }
  }
});


  return Draft;
}));