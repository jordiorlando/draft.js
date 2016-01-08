/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* draft.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Fri Jan 08 2016 01:45:06 GMT-0600 (CST)
*/
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return factory(root, root.document);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS.
    module.exports = root.document ? factory(root, root.document) :
      function(w) {
        return factory(w, w.document);
      };
  } else {
    // Browser globals (root is window)
    root.Draft = factory(root, root.document);
  }
}(typeof window !== "undefined" ? window : this, function(window, document) {
var Draft = this.Draft = {
  mixins: {},

  // TODO:20 add thank you to Olical for Heir
  /**
   * Causes your desired class to inherit from a source class. This uses
   * prototypical inheritance so you can override methods without ruining
   * the parent class.
   *
   * This will alter the actual destination class though, it does not
   * create a new class.
   *
   * @param {Function} destination The target class for the inheritance.
   * @param {Function} source Class to inherit from.
   * @param {Boolean} addSuper Should we add the _super property to the prototype? Defaults to true.
   */
  inherit: function(destination, source, addSuper) {
    var proto = destination.prototype = Object.create(source.prototype);
    proto.constructor = destination;

    if (addSuper || typeof addSuper === 'undefined') {
        destination._super = source.prototype;
    }
  },

  /**
   * Mixes the specified object into your class. This can be used to add
   * certain capabilities and helper methods to a class that is already
   * inheriting from some other class. You can mix in as many object as
   * you want, but only inherit from one.
   *
   * These values are mixed into the actual prototype object of your
   * class, they are not added to the prototype chain like inherit.
   *
   * @param {Function} destination Class to mix the object into.
   * @param {Object} source Object to mix into the class.
   */
  mixin: function(destination, source) {
    // Uses `Object.prototype.hasOwnPropety` rather than `object.hasOwnProperty`
    // as it could be overwritten.
    var hasOwnProperty = function(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    };

    for (var key in source) {
      if (hasOwnProperty(source, key)) {
        destination.prototype[key] = source[key];
      }
    }
  },

  // DOING:0 rename methods to mixins

  // Construct a unique ID from the element's type and ID
  domID: function(element) {
    return 'DraftJS_' +
      element.prop('type') + '_' +
      zeroPad(element.prop('id'), 4);
  },

  // Using standard 96dpi resolution
  // BACKLOG:50 configurable dpi setting
  // TODO:50 safety checks
  // TODO:60 use regexes
  px: function(length) {
    var num = parseFloat(length, 10);
    var units = typeof length == 'string' ? length.slice(-2) : 'px';

    // Remain unchanged if units are already px
    if (units == 'px') {
      return num;
    }
    // Points and picas (pt, pc)
    else if (units == 'pt') {
      return Draft.px(num / 72 + 'in');
    } else if (units == 'pc') {
      return Draft.px(num * 12 + 'pt');
    }
    // Imperial units (in, ft, yd, mi)
    else if (units == 'in') {
      return num * 96;
    } else if (units == 'ft') {
      return Draft.px(num * 12 + 'in');
    } else if (units == 'yd') {
      return Draft.px(num * 3 + 'ft');
    } else if (units == 'mi') {
      return Draft.px(num * 1760 + 'yd');
    }
    // Metric units (mm, cm, m, km)
    else if (units.endsWith('m')) {
      if (units == 'mm') {
        num *= 1;
      } else if (units == 'cm') {
        num *= 10;
      } else if (units == 'km') {
        num *= 1000000;
      }

      return Draft.px(num / 25.4 + 'in');
    } else {
      return false;
    }
  }
};

const defaults = {
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
      function(pos) {
        return pos[0];
      },
      function(pos) {
        return height - pos[1];
      },
      function(pos) {
        return pos[2];
      },
      // Full position
      function(pos) {
        return [
          pos[0],
          height - pos[1],
          pos[2]
        ];
      }
    ],
    polar: [
      function(pos) {
        return Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2));
      },
      function(pos) {
        return Math.atan2(pos[1], pos[0]);
      },
      function(pos) {
        return pos[2];
      },
      // Full position
      function(pos) {
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
      function(pos) {
        return pos[0] * Math.cos(pos[1] * (Math.PI / 180));
      },
      function(pos) {
        return pos[0] * Math.sin(pos[1] * (Math.PI / 180));
      },
      function(pos) {
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

// HACK:0 need a better way of getting an element's type
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
  return element.doc.elements[element.prop('type')].length;
}

// TODO:10 create an actual 'Unit' class for every unit instance
function unit(val) {
  return val == null ? val : val + '_u';
}

Draft.mixins.system = {
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
  // BACKLOG:30 remove svg coordinates?
  // Web/SVG:
  // - page.system('web')
  // - (x, y)
  // - x is right, y is down, z is out of the page (left-hand)
  // - global origin (0, 0) is at top-left

  // BACKLOG:10 switch phi for theta?
  // BACKLOG:0 Spherical (p, theta, phi), Cylindrical (p, phi, z)
  system: function(system) {
    /*if (this.prop('system') != system) {
      // BACKLOG:20 recursively convert all elements to new system?
    }*/
    return this.prop('system', system);
  }
};

Draft.mixins.units = {
  // Get/set the element's measurement units
  units: function(units) {
    return this.prop('units', units);
  }
};

Draft.mixins.size = {
  // Get/set the element's width
  width: function(width) {
    return this.prop('width', unit(width));
  },
  // Get/set the element's height
  height: function(height) {
    return this.prop('height', unit(height));
  },
  // Get/set the element's width & height
  size: function(width, height) {
    return this.prop({
      width: unit(width),
      height: unit(height)
    });
  }
};

Draft.mixins.move = {
  /*// Get/set the element's x position
  x: function(x) {
    return this.prop('x', unit(x));
  },

  // Get/set the element's y position
  y: function(y) {
    return this.prop('y', unit(y));
  },*/

  // Get/set the element's position
  move: function() {
    var pos = {};
    for (var i = 0; i < arguments.length; i++) {
      pos[defaults[this.prop('system')].vars[i]] = unit(arguments[i]);
    }
    return this.prop(pos);
  }
};

Draft.mixins.radius = {
  // Get/set the element's x radius
  rx: function(rx) {
    return this.prop('rx', unit(rx));
  },
  // Get/set the element's y radius
  ry: function(ry) {
    return this.prop('ry', unit(ry));
  },
  // Get/set the element's radius
  radius: function(rx, ry) {
    return this.prop({
      rx: unit(rx),
      ry: unit(ry)
    });
  }
};

Draft.mixins.transform = {
  transform: function(obj) {
    // TODO:30 make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] == null ?
        obj[k] : this.prop(k) + obj[k];
    }

    return this.prop(obj);
  }
};

Draft.mixins.transforms = {
  require: [
    'transform'
  ],
  // Translate the element relative to its current position
  translate: function(x, y) {
    return this.transform({
      x: x,
      y: y
    });
  },
  // Scale the element relative to its current size
  scale: function(x, y, cx, cy) {
    /*return this.transform({
      x: x,
      y: y,
      cx: cx,
      cy: cy
    });*/
  },
  // Rotate the element relative to its current angle
  rotate: function(a, cx, cy) {
    /*return this.transform({
      a: a,
      cx: cx,
      cy: cy
    });*/
  },
  // Skew the element relative to its current skew
  skew: function(ax, ay, cx, cy) {
    /*return this.transform({
      ax: ax,
      ay: ay,
      cx: cx,
      cy: cy
    });*/
  }
};

Draft.mixins.json = {
  stringify: function(replacer) {
    return JSON.stringify(this, replacer, 2);
  }
};

// Draft.Element =
Draft.Element = class Element {
  constructor() {
    // DOING:10 create DOM node
    this.dom = {};
    this.dom.node = document.createElement('object');
    // Store a circular reference in the node
    this.dom.node.element = this;

    // Make sure this.properties is initialized
    this.properties = {};
    this.prop('type', elementType(this));
  }

  static inherit(source, addSuper) {
    Draft.inherit(this, source, addSuper);
  }

  static mixin(source) {
    Draft.mixin(this, source);
  }

  // TODO:40 merge this with mixin()?
  static require(source) {
    if (typeof source == 'string') {
      this.mixin(Draft.mixins[source]);
    } else if (source instanceof Array) {
      for (var mixin of source) {
        this.require(mixin);
      }
    }
  }

  // TODO:70 rename properties to _properties?
  prop(prop, val) {
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
    else if (typeof prop == 'object') {
      let setter = false;

      for (let p in prop) {
        // Get this.properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter |= typeof prop[p] == 'object';
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
      return val === undefined ? defaults[prop] || 0 : val;*/

      // If prop is undefined, set it to the default OR 0
      return this.properties[prop] ||
        this.prop(prop, defaults[prop] || 0);
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      // HACK:10 should use an actual unit data type, not just strings
      if (String(val).endsWith('_u')) {
        val = val.slice(0, -2);
        val = isFinite(val) ?
          val + this.parent.prop('units') || defaults.units : val;
      }

      this.properties[prop] = val;

      var event = new CustomEvent('update', {
        detail: {
          type: this.properties.type,
          prop: prop,
          val: val
        },
        bubbles: true
      });

      this.dom.node.dispatchEvent(event);
    }

    // prop() is chainable if 'this' is returned
    return this;
  }
};

// TODO:0 remove these dependencies from Draft.Element
Draft.Element.require([
  'size',
  'move'
]);

Draft.Container = class Container extends Draft.Element {
  constructor(name) {
    super();

    // Set a name if given
    this.prop('name', name || null);

    // Initialize children array
    this.children = [];
  }

  /*child(child) {
    return this.children[child];
  }*/

  push(child) {
    // Add a reference to the child's parent and containing doc
    child.parent = this;
    child.doc = this.doc || this;

    this.dom.node.appendChild(child.dom.node);

    // Add the child to its type array
    let type = child.prop('type');
    child.doc.elements[type] = child.doc.elements[type] || [];
    child.doc.elements[type].push(child);
    // Set the child's basic properties
    child.prop('id', elementID(child));

    // Add the child to the end of the children array
    this.children.push(child);

    return this;
  }

  add(child) {
    this.push(child);
    return child;
  }
};

Draft.Doc = class Doc extends Draft.Container {
  constructor(name) {
    super(name);

    // Initialize elements container
    this.elements = {};

    this.prop({
      system: defaults.system,
      units: defaults.units
    });
  }
};

Draft.doc = function(name) {
  return new Draft.Doc(name);
};

/*Draft.mixin(Draft, {
  doc: function(name) {
    return new Draft.Doc(name);
  }
});*/

Draft.Group = class Group extends Draft.Container {};

Draft.Group.require([
  'system',
  'units'
]);

Draft.Container.mixin({
  group: function() {
    return this.add(new Draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

Draft.Page = class Page extends Draft.Group {
  // BACKLOG:40 remove page.origin?
  // Set the page's origin relative to its (0, 0) position
  origin(x, y) {
    return this.prop({
      'origin.x': Draft.px(x),
      'origin.y': Draft.px(y)
    });
  }
};

Draft.Doc.mixin({
  page: function(name) {
    return this.add(new Draft.Page(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

Draft.Line = class Line extends Draft.Element {};

Draft.Container.mixin({
  line: function(x1, y1, x2, y2) {
    return this.add(new Draft.Line());
  }
});

Draft.Rect = class Rect extends Draft.Element {
  get rekt() {
    return Math.floor(Math.random() * 101) + '% rekt';
  }
};

Draft.Rect.require('radius');

Draft.Container.mixin({
  rect: function(width, height) {
    return this.add(new Draft.Rect()).size(width, height);
  }
});

Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

Draft.Container.mixin({
  circle: function(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});

  return Draft;
}));