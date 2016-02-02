/*
* draft.js - A lightweight library for parametric design
* version v0.1.0
* http://draft.D1SC0te.ch
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@hexa.io>
* license MIT
*
* BUILT: Tue Feb 02 2016 02:49:16 GMT-0600 (CST)
*/
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.draft = factory();
  }
}(this, function() {
var draft = function draft(name) {
  return draft.doc(name);
};

// Initialize types and mixins
draft.types = {};
draft.mixins = {};

// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

draft.inherit = function inherit(destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
    destination._super = source.prototype;
  }
};

draft.mixin = function mixin(destination, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination.prototype[key] = source[key];
    }
  }
};

draft.proxy = function proxy(obj) {
  var access = function(target, prop) {
    if (typeof prop === 'string') {
      return access(target, prop.split('.'));
    }

    let p = prop.shift();

    if (prop.length > 0) {
      return access(target[p] || (target[p] = {}), prop);
    }

    return [target, p];
  };

  var handler = {
    get(target, prop) {
      var [t, p] = access(target, prop);
      return t[p];
    },
    set(target, prop, val) {
      var [t, p] = access(target, prop);
      t[p] = val;
      return true;
    },
    deleteProperty(target, prop) {
      var [t, p] = access(target, prop);
      delete t[p];
      return true;
    }
  };

  // BACKLOG: wait for browser support for ES6 proxies
  return typeof Proxy === 'function' ? new Proxy(obj, handler) : obj;
};

// TODO: configurable defaults
draft.defaults = draft.proxy({
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
});

draft.types.unit = function unit(val) {
  // TODO: add real code
  return val;
};

// TODO:50 test safety checks for draft.px()
draft.px = function px(val) {
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
function unitHack(val) {
  return val == null ? val : `${val}_u`;
}

draft.types.color = function color(val) {
  var hex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

  var rgb255 = '([01]?\\d\\d?|2[0-4]\\d|25[0-5])';
  var rgb = new RegExp(`^rgb\\(${rgb255}\\, ?${rgb255}\\, ?${rgb255}\\)$`, 'i');

  if (val === undefined || val === null || hex.test(val) || rgb.test(val)) {
    return val;
  }
};

draft.types.opacity = function opacity(val) {
  var from0to1 = /^(0(\.\d*)?|1(\.0*)?)$/;

  if (val === undefined || val === null) {
    return val;
  } else if (from0to1.test(val)) {
    return parseFloat(val, 10);
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

      // NOTE: fire event
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

draft.defaults.system = 'cartesian';

draft.mixins.units = {
  // Get/set the element's measurement units
  units(units) {
    return this.prop('units', units);
  }
};

draft.defaults.units = 'px';

draft.mixins.position = {
  // TODO: find better way of only applying supplied values
  position(x, y, z) {
    return this.prop({
      x: unitHack(x),
      y: unitHack(y),
      z: unitHack(z)
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

draft.mixins.fill = {
  // TODO: combine color and opacity into fill()
  fill(color) {
    return this.fillColor(color);
  },

  fillColor(color) {
    return this.prop('fill.color', draft.types.color(color));
  },

  fillOpacity(opacity) {
    return this.prop('fill.opacity', draft.types.opacity(opacity));
  }
};

draft.defaults['fill.color'] = '#fff';
draft.defaults['fill.opacity'] = 1;

draft.mixins.stroke = {
  // TODO: combine color, opacity, and width into stroke()
  stroke(color) {
    return this.strokeColor(color);
  },

  strokeColor(color) {
    return this.prop('stroke.color', draft.types.color(color));
  },

  strokeOpacity(opacity) {
    return this.prop('stroke.opacity', draft.types.opacity(opacity));
  },

  strokeWidth(width) {
    return this.prop('stroke.width', draft.types.unit(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;

draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: unitHack(width),
      height: unitHack(height)
    });
  },
  // Get/set the element's width
  width(width) {
    return draft.px(this.prop('width', unitHack(width)));
  },
  // Get/set the element's height
  height(height) {
    return draft.px(this.prop('height', unitHack(height)));
  }
};

draft.mixins.radius = {
  // Get/set the element's x radius
  rx(rx) {
    return this.prop('rx', unitHack(rx));
  },
  // Get/set the element's y radius
  ry(ry) {
    return this.prop('ry', unitHack(ry));
  },
  // Get/set the element's radius
  radius(rx, ry) {
    return this.prop({
      rx: unitHack(rx),
      ry: unitHack(ry)
    });
  }
};

draft.Element = class Element {
  constructor(name) {
    // Make sure this._properties is initialized
    this._properties = {};

    // Set a name if given
    if (name) {
      this.prop('name', name);
    }

    // HACK:0 use this.constructor.name to get an element's type. Requires all
    // subclasses to have a defined constructor.
    for (var type in draft) {
      if (this.constructor === draft[type]) {
        this._type = type.toLowerCase();
        break;
      }
    }
    // console.log('TYPE:', type, 'NAME:', this.constructor.name);
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

  prop(prop, val, obj = this._properties) {
    if (prop === undefined) {
      // Act as a full properties getter if prop is undefined
      // TODO: don't create a new object?
      return Object(this._properties);
    } else if (prop === null) {
      // BACKLOG: test deleting all properties, perhaps remove it
      // Delete all properties if prop is null
      this._properties = {};
    } else if (typeof prop === 'string') {
      var props = draft.proxy(this._properties);

      if (val === undefined) {
        // Act as an individual property getter if val is undefined

        // HACK: don't return 0?
        // If prop is undefined, set it to the default OR 0
        if (props[prop] === undefined) {
          this.prop(prop, draft.defaults[prop] || 0);
        }

        return props[prop];
      } else if (val === null) {
        // Delete the property if val is null
        delete props[prop];
      } else {
        // Act as an individual property setter if both prop and val are defined

        // HACK:10 should use an actual unit data type, not just strings
        if (String(val).endsWith('_u')) {
          val = val.slice(0, -2);
          val = isFinite(val) ?
            val + this.parent.prop('units') || draft.defaults.units : val;
        }

        props[prop] = val;
      }

      this.fire('change', [prop, val]);
    } else if (typeof prop == 'object') {
      // Act as a getter if prop is an object with only null values.
      // Act as a setter if prop is an object with at least one non-null value.
      let setter = false;

      for (let p in prop) {
        // Get this._properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p], obj);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter = setter || typeof prop[p] == 'object';
      }

      return setter ? this : prop;
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

draft.doc = function doc(name) {
  var newDoc = new draft.Doc(name);

  (draft.docs || (draft.docs = [])).push(newDoc);
  newDoc._id = draft.docs.length;

  return newDoc;
};

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
    var gcd = function gcd(a, b) {
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
    return this.prop('length', unitHack(length));
  }
};

draft.Line.require('stroke');

draft.Group.mixin({
  line(length) {
    return this.push(new draft.Line()).length(length);
  }
});

draft.Shape = class Shape extends draft.Element {};

draft.Shape.require([
  'fill',
  'stroke',
  'size'
]);

draft.Rect = class Rect extends draft.Shape {
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Rect.require([
  'radius'
]);

draft.Group.mixin({
  rect(width = 100, height = 100) {
    return this.push(new draft.Rect()).size(width, height);
  }
});

draft.Circle = class Circle extends draft.Shape {
  radius(r) {
    return this.prop('r', unitHack(r));
  }
};

draft.Group.mixin({
  circle(r = 50) {
    return this.push(new draft.Circle()).radius(r);
  }
});

return draft;
}));
