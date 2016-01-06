/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* draft.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Wed Jan 06 2016 05:59:05 GMT-0600 (CST)
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
// TODO: come up with a better location for methods
var methods = {};

// TODO: let Draft extend Container (get rid of custom push() and units())
var Draft = this.Draft = class Draft {
  constructor(element) {
    this.elements = {};
    this.children = [];

    // TODO: get rid of DOM dependence
    if (element) {
      // Ensure the presence of a DOM element
      this.dom = typeof element === 'string' ?
        document.getElementById(element) :
        element;
    }
  }

  push(parent, child) {
    // Add a reference to the child's parent
    child.parent = parent;

    // Add the child to the end of the children array
    parent.children.push(child);

    // Add the child to its type array
    var type = elementType(child);
    this.elements[type] = this.elements[type] || [];
    this.elements[type].push(child);

    // Set the child's basic properties
    child.prop({
      type: type,
      id: elementID(child)
    });

    return child;
  }

  units() {
    return defaults.units;
  }

  // This function takes an element and copies the supplied methods to it
  static extend(element, source) {
    if (typeof source === 'string') {
      Draft.extend(element, methods[source]);
    } else if (typeof source === 'object') {
      for (let key in source) {
        if (typeof source[key] === 'function') {
          element.prototype[key] = source[key];
        } else {
          Draft.extend(element, source[key]);
        }
      }
    }

    return source;
  }

  // Construct a unique ID from the element's type and ID
  static domID(element) {
    return 'DraftJS_' +
      element.properties.type + '_' +
      zeroPad(element.properties.id, 4);
  }

  // Using standard 96dpi resolution
  // TODO: configurable dpi setting
  // TODO: safety checks
  static px(length) {
    var num = parseFloat(length, 10);
    var units = typeof length === 'string' ? length.slice(-2) : 'px';

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

function isLength(length) {

}

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
  // console.log(elementType(element) || element instanceof Draft);
  return element instanceof Draft ?
    element : elementDoc(element.parent);
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

methods.json = {
  stringify: function(replacer) {
    return JSON.stringify(this, replacer, 2);
  }
};

methods.system = {
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
  system: function(system) {
    /*if (this.prop('system') != system) {
      // TODO: recursively convert all elements to new system?
    }*/
    return this.prop('system', system);
  }
};

methods.units = {
  // Get/set the element's measurement units
  units: function(units) {
    return this.prop('units', units);
  }
};

methods.size = {
  // Get/set the element's width
  width: function(width) {
    return this.prop('width', width);
  },
  // Get/set the element's height
  height: function(height) {
    return this.prop('height', height);
  },
  // Get/set the element's width & height
  size: function(width, height) {
    return this.prop({
      width: width,
      height: height
    });
  }
};

methods.move = {
  /*// Get/set the element's x position
  x: function(x) {
    return this.prop('x', x);
  },

  // Get/set the element's y position
  y: function(y) {
    return this.prop('y', y);
  },*/

  // Get/set the element's position
  move: function() {
    var pos = {};
    for (var i = 0; i < arguments.length; i++) {
      pos[defaults[this.prop('system')].vars[i]] = arguments[i];
    }
    return this.prop(pos);
  }
};

methods.radius = {
  // Get/set the element's x radius
  rx: function(rx) {
    return this.prop('rx', rx);
  },
  // Get/set the element's y radius
  ry: function(ry) {
    return this.prop('ry', ry);
  },
  // Get/set the element's radius
  radius: function(rx, ry) {
    return this.prop({
      rx: rx,
      ry: ry
    });
  }
};

methods.transform = {
  transform: function(obj) {
    // TODO: make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] == null ?
        obj[k] : this.prop(k) + obj[k];
    }

    return this.prop(obj);
  }
};

methods.transforms = {
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

// Draft.Element =
Draft.Element = class Element {
  constructor(name) {
    // Make sure this.properties is initialized
    this.properties = {};
    this.dom = {};

    this.prop({
      name: name || null
    });
  }

  static extend(source) {
    return Draft.extend(this, source);
  }

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
      return val === undefined ? defaults[prop] || 0 : val;*/

      // If prop is undefined, set it to the default OR 0
      return this.properties[prop] ||
        this.prop(prop, defaults[prop] || 0);
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      // TODO: clean up this.parent.units()
      this.properties[prop] = prop !== 'id' && isFinite(val) ?
        val + this.parent.units() || defaults.units : val;
    }

    updateDOM(this);

    // prop() is chainable if 'this' is returned
    return this;
  }

  parent() {
    return this.parent;
  }
};

Draft.Element.extend([
  'size',
  'move'
]);

Draft.Container = class Container extends Draft.Element {
  constructor() {
    super();

    // Initialize children array
    this.children = [];
  }

  child(child) {
    return this.children[child];
  }

  add(element) {
    return elementDoc(this).push(this, element);
  }
};

// Draft.extend(Draft, Draft.Container);

Draft.Group = class Group extends Draft.Container {
};

Draft.Group.extend([
  'system',
  'units'
]);

Draft.Container.extend({
  group: function(name) {
    return this.add(new Draft.Group(name)).prop({
      system: this.system(),
      units: this.units()
    });
  }
});

Draft.Page = class Page extends Draft.Group {
  // Set the page's origin relative to its (0, 0) position
  // TODO: remove this?
  origin(x, y) {
    return this.prop({
      'origin.x': x,
      'origin.y': y
    });
  }
};

// TODO: make this modular like the others, and de-dupe the prop code
Draft.extend(Draft, {
  page: function(name) {
    return this.push(this, new Draft.Page(name)).prop({
      system: defaults.system,
      units: defaults.units
    });
  }
});

Draft.Line = class Line extends Draft.Element {
};

Draft.Container.extend({
  line: function(x1, y1, x2, y2) {
    return this.add(new Draft.Line());
  }
});

Draft.Rect = class Rect extends Draft.Element {
  get rekt() {
    return Math.floor(Math.random() * 101) + '% rekt';
  }
};

Draft.Rect.extend([
  'radius'
]);

Draft.Container.extend({
  rect: function(width, height) {
    return this.add(new Draft.Rect()).size(width, height);
  }
});

Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', r);
  }
};

Draft.Container.extend({
  circle: function(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});

  return Draft;
}));