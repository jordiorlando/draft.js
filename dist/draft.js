/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* https://github.com/D1SC0tech/draft.js
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@gmail.com>
* license MIT
*
* BUILT: Thu Jan 14 2016 03:50:12 GMT-0600 (CST)
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
var Draft = {
  mixins: {},

  // TODO:50 test safety checks for Draft.px()
  px(val) {
    var num = parseFloat(val, 10);
    var units = testUnits(val);

    switch (units) {
      // Remain unchanged if units are already px
      case 'px':
        return num;

      // Points and picas (pt, pc)
      case 'pc':
        num *= 12;
        // Falls through
      case 'pt':
        num /= 72;
        break;

      // Metric units (mm, cm, dm, m, km)
      case 'km':
        num *= 1000;
        // Falls through
      case 'm':
        num *= 10;
        // Falls through
      case 'dm':
        num *= 10;
        // Falls through
      case 'cm':
        num *= 10;
        // Falls through
      case 'mm':
        num /= 25.4;
        break;

      // Imperial units (in, ft, yd, mi)
      case 'mi':
        num *= 1760;
        // Falls through
      case 'yd':
        num *= 3;
        // Falls through
      case 'ft':
        num *= 12;
        // Falls through
      case 'in':
        break;
      default:
        return undefined;
    }

    return num * Draft.defaults.dpi;
  }
};

// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

Draft.inherit = function(destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
    destination._super = source.prototype;
  }
};

Draft.mixin = function(destination, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination.prototype[key] = source[key];
    }
  }
};

// TODO: configurable defaults
Draft.defaults = {
  system: 'cartesian',
  units: 'px',
  /* width: 0,
  length: 0,
  r: 0, // radius
  a: 0, // angle */

  get dpi() {
    var test = document.createElement('div');
    test.style.width = '1in';
    test.style.padding = 0;
    document.getElementsByTagName('body')[0].appendChild(test);

    var dpi = test.offsetWidth;

    document.getElementsByTagName('body')[0].removeChild(test);

    // Fall back to standard 96dpi resolution
    return dpi || 96;
  }
  /* ,

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
      'ρ',
      'φ',
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
      'ρ',
      'φ',
      'θ'
    ]
  } */
};

// TODO:10 create an actual 'Unit' class for every unit instance
function unit(val) {
  return val == null ? val : `${val}_u`;
}

function testUnits(val, units) {
  var regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;
  val = String(val);

  if (typeof units == 'string') {
    return new RegExp(`${regex.source}${units}$`, 'ig').test(val);
  }

  // TODO: don't default to px?
  return regex.exec(val) === null ?
    false : val.slice(regex.lastIndex) || 'px';
}

// BACKLOG: use Proxy to create a clean element tree (ignore all parent keys)

// These methods are adapted from Oliver Caldwell's EventEmitter library, which
// he has released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/EventEmitter

// TODO: implement bubbling?

Draft.mixins.event = {
  on(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];

      if (!listeners.map(l => l.listener).includes(listener)) {
        listeners.push(typeof listener === 'object' ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  },

  once(evt, listener) {
    return this.on(evt, {
      listener: listener,
      once: true
    });
  },

  off(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var index = listeners.map(l => l.listener).lastIndexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }

    return this;
  },

  fire(evt, args) {
    // Put args in an array if it isn't already one
    if (!Array.isArray(args)) {
      args = [args];
    }

    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var i = listeners.length;

      while (i--) {
        /* console.info('event fired:', {
          target: this,
          timeStamp: new Date(),
          type: key
        }, args); */

        var listener = listeners[i];
        var response = listener.listener.apply({
          target: this,
          // TODO: Date.now() to prevent memory leaks?
          timeStamp: new Date(),
          type: key
        }, args);

        // If the listener returns 'off' then it gets removed from the event
        if (listener.once === true || response === 'off') {
          this.off(evt, listener.listener);
        }
      }
    }

    return this;
  },

  defineEvent() {
    for (let i = 0; i < arguments.length; i++) {
      this.getListeners(arguments[i]);
    }

    return this;
  },

  removeEvent(evt) {
    var events = this._getEvents();

    // Remove different things depending on the state of evt
    if (typeof evt === 'string') {
      // Remove all listeners for the specified event
      delete events[evt];
    } else if (evt instanceof RegExp) {
      // Remove all events matching the regex.
      for (var key in events) {
        if (evt.test(key)) {
          delete events[key];
        }
      }
    } else {
      // Remove all listeners in all events
      delete this._events;
    }

    return this;
  },

  getListeners(evt, map) {
    var events = this._getEvents();
    var listeners = {};

    // Return a concatenated array of all matching events if
    // the selector is a regular expression.
    if (evt instanceof RegExp) {
      for (var key in events) {
        if (evt.test(key)) {
          listeners[key] = events[key];
        }
      }
    } else {
      var listener = events[evt] || (events[evt] = []);

      if (map === undefined) {
        listeners = listener;
      } else {
        listeners[evt] = listener;
      }
    }

    /* if (map !== undefined) {
      listeners = Object.keys(listeners).map(key => listeners[key]);
    } */

    return listeners;
  },

  /**
   * Fetches the events object and creates one if required.
   *
   * @return {Object} The events storage object.
   * @api private
   */
  _getEvents() {
    return this._events || (this._events = {});
  }
};

Draft.mixins.system = {
  // Cartesian:
  // - page.system('cartesian')
  // - (x, y)
  // - x is right, y is up, z is out of the page (right-hand)
  // - global origin (0, 0) is at bottom-left
  //
  // Polar:
  // - page.system('polar')
  // - (r, φ)
  // - φ is counter-clockwise, with 0 pointing to the right
  // - global pole (0, 0) is at center
  //
  // BACKLOG:30 remove svg coordinates?
  // Web/SVG:
  // - page.system('web')
  // - (x, y)
  // - x is right, y is down, z is out of the page (left-hand)
  // - global origin (0, 0) is at top-left

  // BACKLOG:10 switch φ for θ?
  // BACKLOG:0 Spherical (ρ, θ, φ), Cylindrical (ρ, φ, z)
  system(system) {
    /* if (this.prop('system') != system) {
      // BACKLOG:20 recursively convert all elements to new system?
    } */
    return this.prop('system', system);
  }
};

Draft.mixins.units = {
  // Get/set the element's measurement units
  units(units) {
    return this.prop('units', units);
  }
};

Draft.mixins.position = {
  position(x, y, z) {
    return this.prop({
      x: unit(x),
      y: unit(y),
      z: unit(z)
    });
  },

  pos(...args) {
    return this.position(...args);
  },

  translate(x, y, z) {
    x = this.prop('x') + x || 0;
    y = this.prop('y') + y || 0;
    z = this.prop('z') + z || 0;

    return this.position(x, y, z);
  }
};

Draft.mixins.rotation = {
  rotation(α, β, γ) {
    return this.prop({
      α: α,
      β: β,
      γ: γ
    });
  },

  rot(...args) {
    return this.rotation(...args);
  },

  rotate(α, β, γ) {
    α = this.prop('α') + α || 0;
    β = this.prop('β') + β || 0;
    γ = this.prop('γ') + γ || 0;

    return this.position(α, β, γ);
  }
};

Draft.mixins.size = {
  // Get/set the element's width
  width(width) {
    return this.prop('width', unit(width));
  },
  // Get/set the element's height
  height(height) {
    return this.prop('height', unit(height));
  },
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: unit(width),
      height: unit(height)
    });
  }
};

Draft.mixins.radius = {
  // Get/set the element's x radius
  rx(rx) {
    return this.prop('rx', unit(rx));
  },
  // Get/set the element's y radius
  ry(ry) {
    return this.prop('ry', unit(ry));
  },
  // Get/set the element's radius
  radius(rx, ry) {
    return this.prop({
      rx: unit(rx),
      ry: unit(ry)
    });
  }
};

Draft.mixins.json = {
  stringify(replacer) {
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

    // Make sure this._properties is initialized
    this._properties = {};

    // HACK:0 need a better way of getting an element's type
    for (var type in Draft) {
      if (this.constructor === Draft[type]) {
        this.prop('type', type.toLowerCase());
        break;
      }
    }
  }

  static inherit(source, addSuper) {
    Draft.inherit(this, source, addSuper);
  }

  static mixin(source) {
    Draft.mixin(this, source);
  }

  // TODO:40 merge require() with mixin()?
  static require(source) {
    if (typeof source == 'string') {
      this.mixin(Draft.mixins[source]);
    } else if (Array.isArray(source)) {
      for (var mixin of source) {
        this.require(mixin);
      }
    }
  }

  get type() {
    return this.prop('type');
  }

  get id() {
    return this.prop('id');
  }

  // Construct a unique ID from the element's type and ID
  get domID() {
    var id = String(this.id);
    while (id.length < 4) {
      id = `0${id}`;
    }

    return [
      'DraftJS',
      this.type,
      id
    ].join('_');
  }

  prop(prop, val) {
    if (prop === null) {
      // BACKLOG: test deleting all properties, perhaps remove it
      // Delete all properties if prop is null
      this._properties = {};
    } else if (prop === undefined) {
      // Act as a full properties getter if prop is undefined
      return new Object(this._properties);
    } else if (typeof prop == 'object') {
      // Act as a getter if prop is an object with only null values.
      // Act as a setter if prop is an object with at least one non-null value.
      let setter = false;

      for (var p in prop) {
        // Get this._properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter = setter || typeof prop[p] == 'object';
      }

      return setter ? this : prop;
    } else if (val === null) {
      // Delete the property if val is null
      delete this._properties[prop];
    } else if (val === undefined) {
      // Act as an individual property getter if val is undefined

      // TODO: don't return 0?
      // If prop is undefined, set it to the default OR 0
      return this._properties[prop] ||
        (this._properties[prop] = Draft.defaults[prop] || 0);
    } else {
      // Act as an individual property setter if both prop and val are defined

      // HACK:10 should use an actual unit data type, not just strings
      if (String(val).endsWith('_u')) {
        val = val.slice(0, -2);
        val = isFinite(val) ?
          val + this.parent.prop('units') || Draft.defaults.units : val;
      }

      this._properties[prop] = val;

      var event = new CustomEvent('update', {
        detail: {
          type: this._properties.type,
          prop: prop,
          val: val
        },
        bubbles: true
      });

      this.dom.node.dispatchEvent(event);

      this.fire('change', [prop, val]);
      /* {
        // target: this,
        // type: this._properties.type,
        prop: prop,
        val: val
      }); */
    }

    // prop() is chainable if 'this' is returned
    return this;
  }
};

Draft.Element.require([
  'event',
  'position',
  'rotation'
]);

Draft.Container = class Container extends Draft.Element {
  constructor(name) {
    super();

    // Set a name if given
    this.prop('name', name || null);

    // Initialize children array
    this.children = [];
  }

  get name() {
    return this.prop('name');
  }

  /* child(child) {
    return this.children[child];
  } */

  push(child) {
    // Add a reference to the child's parent and containing doc
    child.parent = this;
    child.doc = this.doc || this;

    this.dom.node.appendChild(child.dom.node);

    // Add the child to its type array
    var type = child.type;
    child.doc.elements[type] = child.doc.elements[type] || [];
    child.doc.elements[type].push(child);
    // Set the child's basic properties
    child.prop('id', child.doc.elements[child.type].length);

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
      system: Draft.defaults.system,
      units: Draft.defaults.units
    });
  }
};

Draft.doc = function(name) {
  return new Draft.Doc(name);
};

/* Draft.mixin(Draft, {
  doc(name) {
    return new Draft.Doc(name);
  }
}); */

Draft.Group = class Group extends Draft.Container {};

Draft.Group.require([
  'system',
  'units'
]);

// TODO: mixin to Draft.group
Draft.Container.mixin({
  group() {
    return this.add(new Draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

Draft.View = class View extends Draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */
};

Draft.View.require('size');

Draft.Group.mixin({
  view(width, height) {
    return this.add(new Draft.View()).size(width, height);
  }
});

Draft.Page = class Page extends Draft.Group {};

Draft.Page.require('size');

Draft.Doc.mixin({
  page(name) {
    return this.add(new Draft.Page(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

Draft.Line = class Line extends Draft.Element {
  length(length) {
    return this.prop('length', unit(length));
  }
};

Draft.Group.mixin({
  line(length) {
    return this.add(new Draft.Line()).length(length);
  }
});

Draft.Rect = class Rect extends Draft.Element {
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

Draft.Rect.require([
  'size',
  'radius'
]);

Draft.Group.mixin({
  rect(width, height) {
    return this.add(new Draft.Rect()).size(width, height);
  }
});

Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

Draft.Group.mixin({
  circle(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});

  return Draft;
}));