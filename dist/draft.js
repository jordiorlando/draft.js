/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* https://github.com/D1SC0tech/draft.js
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@gmail.com>
* license MIT
*
* BUILT: Tue Jan 19 2016 19:07:42 GMT-0600 (CST)
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
    root.draft = factory(root, root.document);
  }
}(typeof window !== 'undefined' ? window : this, function(window, document) {
var draft = function(name) {
  return draft.doc(name);
};

// TODO: configurable defaults
draft.defaults = {
  system: 'cartesian',
  units: 'px',
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
};

draft.mixins = {};

// TODO:50 test safety checks for draft.px()
draft.px = function(val) {
  val = String(val);
  var num = parseFloat(val, 10);

  var regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;

  /* if (typeof units == 'string') {
    return new RegExp(`${regex.source}${units}$`, 'ig').test(val);
  } */

  // TODO: don't default to px?
  var units = regex.exec(val) === null ?
    false : val.slice(regex.lastIndex) || 'px';

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

  return num * draft.defaults.dpi;
};

// DOING:10 create an actual 'Unit' class for every unit instance
function unit(val) {
  return val == null ? val : `${val}_u`;
}

// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

draft.inherit = function(destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
    destination._super = source.prototype;
  }
};

draft.mixin = function(destination, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination.prototype[key] = source[key];
    }
  }
};

// These methods are adapted from Oliver Caldwell's EventEmitter library, which
// he has released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/EventEmitter

// BACKLOG: implement bubbling?

draft.mixins.event = {
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

  // TODO: use rest for args (...args)
  fire(evt, args) {
    // Put args in an array if it isn't already one
    if (!Array.isArray(args)) {
      args = [args];
    }

    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var i = listeners.length;

      if (i > 0) {
        console.info(`${this.domID} ${key}:`, args);
      }

      while (i--) {
        var listener = listeners[i];
        var response = listener.listener.apply({
          target: this,
          // TODO: Date.now() to prevent memory leaks?
          timeStamp: Date(),
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

  defineEvent(...evts) {
    for (var evt of evts) {
      this.getListeners(evt);
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

draft.mixins.system = {
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

draft.mixins.units = {
  // Get/set the element's measurement units
  units(units) {
    return this.prop('units', units);
  }
};

draft.mixins.position = {
  // TODO: find better way of only applying supplied values
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

draft.mixins.rotation = {
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

draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: unit(width),
      height: unit(height)
    });
  },
  // Get/set the element's width
  width(width) {
    return draft.px(this.prop('width', unit(width)));
  },
  // Get/set the element's height
  height(height) {
    return draft.px(this.prop('height', unit(height)));
  }
};

draft.mixins.radius = {
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

// draft.Element =
draft.Element = class Element {
  constructor(name) {
    // Make sure this._properties is initialized
    this._properties = {};

    // Set a name if given
    if (name) {
      this.prop('name', name);
    }

    // HACK:0 need a better way of getting an element's type
    for (var type in draft) {
      if (this.constructor === draft[type]) {
        this._type = type.toLowerCase();
        break;
      }
    }
  }

  static inherit(source, addSuper) {
    draft.inherit(this, source, addSuper);
  }

  static mixin(source) {
    draft.mixin(this, source);
  }

  // TODO:40 merge require() with mixin()?
  static require(source) {
    if (typeof source == 'string') {
      this.mixin(draft.mixins[source]);
    } else if (Array.isArray(source)) {
      for (var mixin of source) {
        this.require(mixin);
      }
    }
  }

  get type() {
    return this._type;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.prop('name');
  }

  // Construct a unique ID from the element's type and ID
  get domID() {
    var id = String(this.id);
    while (id.length < 4) {
      id = `0${id}`;
    }

    return `${this.type}_${id}`;
  }

  prop(prop, val) {
    if (prop === null) {
      // BACKLOG: test deleting all properties, perhaps remove it
      // Delete all properties if prop is null
      this._properties = {};
    } else if (prop === undefined) {
      // Act as a full properties getter if prop is undefined
      return Object(this._properties);
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
      this.fire('change', [prop, val]);
      delete this._properties[prop];
    } else if (val === undefined) {
      // Act as an individual property getter if val is undefined

      // HACK: don't return 0?
      // If prop is undefined, set it to the default OR 0
      if (this._properties[prop] === undefined) {
        this.prop(prop, draft.defaults[prop] || 0);
      }

      return this._properties[prop];
    } else {
      // Act as an individual property setter if both prop and val are defined

      // HACK:10 should use an actual unit data type, not just strings
      if (String(val).endsWith('_u')) {
        val = val.slice(0, -2);
        val = isFinite(val) ?
          val + this.parent.prop('units') || draft.defaults.units : val;
      }

      this._properties[prop] = val;

      this.fire('change', [prop, val]);
    }

    // Chainable if 'this' is returned
    return this;
  }

  // TODO: use rest (...blacklist)
  stringify(blacklist) {
    var replacer;

    if (Array.isArray(blacklist)) {
      replacer = function(key, val) {
        if (blacklist.includes(key)) {
          return undefined;
        }

        return val;
      };
    } else if (blacklist instanceof RegExp) {
      replacer = function(key, val) {
        if (blacklist.test(key)) {
          return undefined;
        }

        return val;
      };
    }

    return JSON.stringify(this, replacer, 2);
  }

  toJSON() {
    return {
      type: this.type,
      id: this.id,
      properties: this.prop(),
      children: this.children
    };
  }
};

draft.Element.require([
  'event',
  'position',
  'rotation'
]);

draft.Container = class Container extends draft.Element {
  constructor(name) {
    super(name);

    // Initialize children array
    this.children = [];
  }

  get firstChild() {
    return this.children[0];
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  add(child) {
    // Add a reference to the child's parent and containing doc
    child.parent = this;
    child.doc = this.doc || this;

    // Add the child to its type array
    var type = child.type;
    (child.doc.elements[type] || (child.doc.elements[type] = [])).push(child);
    // Set the child's id
    child._id = child.doc.elements[type].length;

    // Add the child to the end of the children array
    this.children.push(child);

    // Fire the 'add' event to all listeners
    this.fire('add', [child]);

    return this;
  }

  push(child) {
    this.add(child);
    return child;
  }

  remove(child) {
    this.fire('remove', [child]);
    return this;
  }
};

draft.Doc = class Doc extends draft.Container {
  constructor(name) {
    super(name);

    // Initialize elements container
    this.elements = {};

    this.prop({
      system: draft.defaults.system,
      units: draft.defaults.units
    });
  }
};

draft.doc = function(name) {
  var doc = new draft.Doc(name);

  (draft.docs || (draft.docs = [])).push(doc);
  doc._id = draft.docs.length;

  return doc;
};

/* draft.mixin(draft, {
  doc(name) {
    return new draft.Doc(name);
  }
}); */

draft.Group = class Group extends draft.Container {};

draft.Group.require([
  'system',
  'units'
]);

// TODO: mixin to draft.Group?
draft.Container.mixin({
  group(name) {
    return this.push(new draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */

  get aspectRatio() {
    var gcd = function(a, b) {
      return b ? gcd(b, a % b) : a;
    };

    gcd = gcd(this.width(), this.height());
    return `${this.width() / gcd}:${this.height() / gcd}`;
  }
};

draft.View.require('size');

draft.Group.mixin({
  view(width, height) {
    return this.push(new draft.View()).size(width, height);
  }
});

draft.Line = class Line extends draft.Element {
  length(length) {
    return this.prop('length', unit(length));
  }
};

draft.Group.mixin({
  line(length) {
    return this.push(new draft.Line()).length(length);
  }
});

draft.Rect = class Rect extends draft.Element {
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Rect.require([
  'size',
  'radius'
]);

draft.Group.mixin({
  rect(width = 100, height = 100) {
    return this.push(new draft.Rect()).size(width, height);
  }
});

draft.Circle = class Circle extends draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

draft.Group.mixin({
  circle(r = 50) {
    return this.push(new draft.Circle()).radius(r);
  }
});

  return draft;
}));