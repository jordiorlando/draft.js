/*
* draft.js - A lightweight library for parametric design
* version v0.2.0
* http://draft.D1SC0te.ch
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@hexa.io>
* license MIT
*
* BUILT: Fri Feb 05 2016 10:46:44 GMT-0600 (CST)
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

// TODO: prefer operators at beginning of lines?

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

draft.proxy = function proxy(obj, setInit = true) {
  var access = function(target, prop, init) {
    if (typeof prop === 'string') {
      return access(target, prop.split('.'), init);
    }

    let p = prop.shift();

    if (prop.length && typeof target === 'object' && (init || p in target)) {
      // TODO: when init is false, setting obj['foo.bar'] will incorrectly set
      // obj['foo'] instead
      return access(p in target ? target[p] : (target[p] = {}), prop, init);
    }

    return [target, p];
  };

  // TODO: return null if the property does not exist or was not set/deleted?
  var handler = {
    has(target, prop) {
      var [t, p] = access(target, prop);
      return !!t[p];
    },
    get(target, prop) {
      var [t, p] = access(target, prop);
      return t[p];
    },
    set(target, prop, val) {
      var [t, p] = access(target, prop, setInit);
      t[p] = val;
      return true;
    },
    deleteProperty(target, prop) {
      var [t, p] = access(target, prop);
      return delete t[p];
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

draft.types.Float = class Float {
  constructor(value) {
    this.value = parseFloat(value);
  }

  get type() {
    return 'float';
  }

  get regex() {
    // Matches all floating point values. Should match:
    // 123
    // -123.45
    // 123e5
    // 123.45E+5
    return '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?';
  }

  valueOf() {
    return this.value;
  }
};

draft.types.float = function float(value) {
  return value == undefined ? value : new draft.types.Float(value);
};

var test = function(val, regex) {
  // TODO: strict match anchor (^ instead of word end)
  regex = new RegExp(`${regex}$`, 'i');
  val = regex.exec(val);
  return val ? val[0].toLowerCase() : false;
};

draft.types.Length = class Length extends draft.types.Float {
  constructor(value, unit) {
    super(value);

    value = test(value, this.regex);
    unit = test(unit, this.regex);

    if (!isNaN(this.value) && (value || unit)) {
      this.unit = value || unit;
      this.convert(unit);
    } else {
      this.unit = '';
    }
  }

  get type() {
    return 'length';
  }

  get regex() {
    return `(px|pt|pc|in|ft|yd|mi|mm|cm|dm|km|m)`;
  }

  get units() {
    return {
      px: [1, 1, 'px'],
      pt: [1, 72, 'px'],
      pc: [12, 1, 'pt'],
      in: [draft.defaults.dpi, 1, 'px'],
      ft: [12, 1, 'in'],
      yd: [3, 1, 'ft'],
      mi: [1760, 1, 'yd'],
      mm: [1, 25.4, 'in'],
      cm: [10, 1, 'mm'],
      dm: [10, 1, 'cm'],
      m: [10, 1, 'dm'],
      km: [1000, 1, 'm']
    };
  }

  convert(newUnit) {
    newUnit = test(newUnit, this.regex);

    if (!newUnit) {
      return false;
    }

    var chain = (unit, reverse) => {
      let units = this.units[unit];

      this.value *= reverse ? units[1] : units[0];
      this.value /= reverse ? units[0] : units[1];

      return units[2];
    };

    let unit = this.unit;
    while (unit !== newUnit && unit !== 'px') {
      unit = chain(unit);
    }

    if (unit !== newUnit) {
      unit = newUnit;
      while (unit !== 'px') {
        unit = chain(unit, true);
      }
    }

    this.unit = newUnit;

    return this.toString();
  }

  valueOf() {
    return new Length(this.toString(), draft.defaults.units).value;
  }

  toString() {
    return this.value + this.unit;
  }
};

draft.types.length = function length(value, unit) {
  return value == undefined ? value : new draft.types.Length(value, unit);
};

draft.types.Color = class Color {
  constructor(color) {
    color = new RegExp(`^(?:${this.regex})$`, 'i').exec(
      isNaN(color) ? color : color.toString(16));

    if (color !== null) {
      this.color = color[0].toLowerCase();

      for (let i = 1; i <= 3; i++) {
        color[i] = parseInt(color[i] ||
          parseInt(color[i + 3] || color[i + 6].repeat(2), 16), 10);
      }

      this.red = color[1];
      this.green = color[2];
      this.blue = color[3];
    }
  }

  get type() {
    return 'color';
  }

  get regex() {
    var rgbColor = '([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])';
    var rgb = `rgb\\(${rgbColor}, ?${rgbColor}, ?${rgbColor}\\)`;

    var hexColor = '([0-9a-f]{2})'.repeat(3);
    var hex = `#?(?:${hexColor}|${hexColor.replace(/\{2\}/g, '')})`;
    // var hex = '#?(?:[0-9a-f]{3}){1,2}';

    return `${rgb}|${hex}`;
  }

  valueOf() {
    return (this.red << 16) | (this.green << 8) | this.blue;
  }

  toString() {
    return this.color;
  }
};

draft.types.color = function color(value) {
  return value == undefined ? value : new draft.types.Color(value);
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
      x: draft.types.length(x),
      y: draft.types.length(y),
      z: draft.types.length(z)
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
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('fill.opacity', opacity);
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
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('stroke.opacity', opacity);
  },

  strokeWidth(width) {
    return this.prop('stroke.width', draft.types.length(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;

draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: draft.types.length(width),
      height: draft.types.length(height)
      // depth: draft.types.length(depth)
    });
  },

  scale(width, height) {
    return this.prop({
      width: this.prop('width') * width || undefined,
      height: this.prop('height') * height || undefined
      // depth: this.prop('depth') * depth || undefined
    });
  }
};

draft.mixins.radius = {
  // Get/set the element's x radius
  rx(rx) {
    return this.prop('rx', draft.types.length(rx));
  },
  // Get/set the element's y radius
  ry(ry) {
    return this.prop('ry', draft.types.length(ry));
  },
  // Get/set the element's radius
  radius(rx, ry) {
    return this.prop({
      rx: draft.types.length(rx),
      ry: draft.types.length(ry)
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
        // TODO: do a fuzzy-find? For example, el.prop('width') would match
        // el._properties.size.width if el._properties.width is undefined
        return prop in props ? props[prop] : null;
      } else if (val === null) {
        // Delete the property if val is null
        delete props[prop];
      } else {
        // Act as an individual property setter if both prop and val are defined

        if (typeof val === 'object') {
          let unit;

          switch (val.type) {
            case 'length':
              unit = this.parent.prop('units') || draft.defaults.units;
              val.unit = val.unit || unit;
              val.convert(unit);
              // Falls through
            case 'color':
              val = String(val);
              break;
          }
        }

        props[prop] = val;
      }

      this.fire('change', [prop, val]);
    } else if (typeof prop === 'object') {
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
    var width = draft.types.length(this.prop('width')).value;
    var height = draft.types.length(this.prop('height')).value;

    var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    };

    gcd = gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }
};

draft.View.require('size');

draft.Group.mixin({
  // TODO: get group bounding box for default size
  view(width = 100, height = 100) {
    return this.push(new draft.View()).size(width, height);
  }
});

draft.Point = class Point extends draft.Element {};

draft.Point.require('stroke');

draft.Group.mixin({
  point() {
    return this.push(new draft.Point());
  }
});

draft.Line = class Line extends draft.Point {
  length(length) {
    return this.prop('length', draft.types.length(length));
  }
};

draft.Group.mixin({
  line(length = 100) {
    return this.push(new draft.Line()).length(length);
  }
});

draft.Shape = class Shape extends draft.Point {};

draft.Shape.require([
  'fill',
  'size'
]);

draft.Rect = class Rect extends draft.Shape {
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Rect.require('radius');

draft.Group.mixin({
  rect(width = 100, height = 100) {
    return this.push(new draft.Rect()).size(width, height);
  }
});

draft.Circle = class Circle extends draft.Shape {
  radius(r) {
    return this.prop('r', draft.types.length(r));
  }
};

draft.Group.mixin({
  circle(r = 50) {
    return this.push(new draft.Circle()).radius(r);
  }
});

return draft;
}));
