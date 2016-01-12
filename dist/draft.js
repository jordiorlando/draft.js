/*
* draft.js - A lightweight library for parametric design
* version v0.0.0
* https://github.com/D1SC0tech/draft.js
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@gmail.com>
* license MIT
*
* BUILT: Mon Jan 11 2016 21:45:50 GMT-0600 (CST)
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

  // Construct a unique ID from the element's type and ID
  domID: function(element) {
    return 'DraftJS_' +
      element.prop('type') + '_' +
      zeroPad(element.prop('id'), 4);
  },

  // BACKLOG:50 configurable dpi setting
  // TODO:50 test safety checks for Draft.px()
  px: function(val) {
    var num = parseFloat(val, 10);
    var units = testUnits(val);

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
      return num * defaults.dpi;
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
      return undefined;
    }
  }
};

// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

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
Draft.inherit = function(destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
      destination._super = source.prototype;
  }
};

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
Draft.mixin = function(destination, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination.prototype[key] = source[key];
    }
  }
};

// TODO: configurable defaults
const defaults = {
  system: 'cartesian',
  units: 'px',
  /*width: 0,
  length: 0,
  r: 0, // radius
  a: 0, // angle*/

  // Standard 96dpi resolution
  dpi: 96/*,

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
  }*/
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
  for (var type in Draft) {
    if (element.constructor == Draft[type]) {
      return type.toLowerCase();
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

function testUnits(val, units) {
  let regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;
  val = String(val);

  if (typeof units == 'string') {
    return new RegExp(regex.source + units + '$', 'ig').test(val);
  } else {
    // TODO: don't default to px?
    return regex.exec(val) !== null ?
      val.slice(regex.lastIndex) || 'px' : false;
  }
}

// BACKLOG: use Proxy to create a clean element tree (e.g. ignore all parent keys)

// These methods are adapted from Oliver Caldwell's EventEmitter library, which
// he has released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/EventEmitter

// TODO: implement bubbling?

Draft.mixins.event = {
  /**
   * Adds a listener function to the specified event.
   * The listener will not be added if it is a duplicate.
   * If the listener returns true then it will be removed after it is called.
   * If you pass a regular expression as the event name then the listener will be added to all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to attach the listener to.
   * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  on: function(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (let key in listenersMap) {
      var listeners = listenersMap[key];

      // BACKLOG: change to Array.prototype.includes() for checking:
      // if (!listeners.map(l => l.listener).includes(listener))
      if (listeners.map(l => l.listener).lastIndexOf(listener) === -1) {
        listeners.push(typeof listener === 'object' ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  },

  /**
   * Semi-alias of on. It will add a listener that will be
   * automatically removed after its first execution.
   *
   * @param {String|RegExp} evt Name of the event to attach the listener to.
   * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  once: function(evt, listener) {
    return this.on(evt, {
      listener: listener,
      once: true
    });
  },

  /**
   * Removes a listener function from the specified event.
   * When passed a regular expression as the event name, it will remove the listener from all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to remove the listener from.
   * @param {Function} listener Method to remove from the event.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  off: function(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (let key in listenersMap) {
      var listeners = listenersMap[key];
      var index = listeners.map(l => l.listener).lastIndexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }

    return this;
  },

  /**
   * Emits an event of your choice.
   * When emitted, every listener attached to that event will be executed.
   * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
   * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
   * So they will not arrive within the array on the other side, they will be separate.
   * You can also pass a regular expression to emit to all events that match it.
   *
   * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
   * @param {Array} [args] Optional array of arguments to be passed to each listener.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  fire: function(evt, args) {
    // Put args in an array if it isn't already one
    if (!Array.isArray(args)) {
      args = [args];
    }

    var listenersMap = this.getListeners(evt, true);

    for (let key in listenersMap) {
      var listeners = listenersMap[key];
      var i = listeners.length;

      while (i--) {
        console.info('event fired:', {
          target: this,
          timeStamp: new Date(), // TODO: Date.now() to prevent memory leaks?
          type: key
        }, args);

        // The function is executed either with a basic call or an apply if there is an args array
        var listener = listeners[i];
        var response = listener.listener.apply({
          target: this,
          timeStamp: new Date(), // TODO: Date.now() to prevent memory leaks?
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

  /**
   * Uses defineEvent to define multiple events.
   *
   * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
   * You need to tell it what event names should be matched by a regex.
   *
   * @param {String} evt Name of the event to create.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  defineEvent: function() {
    for (let i = 0; i < arguments.length; i++) {
      this.getListeners(arguments[i]);
    }

    return this;
  },

  /**
   * Removes all listeners from a specified event.
   * If you do not specify an event then all listeners will be removed.
   * That means every event will be emptied.
   * You can also pass a regex to remove all events that match it.
   *
   * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  removeEvent: function(evt) {
    var events = this._getEvents();

    // Remove different things depending on the state of evt
    if (typeof evt === 'string') {
      // Remove all listeners for the specified event
      delete events[evt];
    } else if (evt instanceof RegExp) {
      // Remove all events matching the regex.
      for (let key in events) {
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

  /**
   * Returns the listener array for the specified event.
   * Will initialise the event object and listener arrays if required.
   * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
   * Each property in the object response is an array of listener functions.
   *
   * @param {String|RegExp} evt Name of the event to return the listeners from.
   * @return {Function[]|Object} All listener functions for the event.
   */
  getListeners: function(evt, map) {
    var events = this._getEvents();
    var listeners = {};

    // Return a concatenated array of all matching events if
    // the selector is a regular expression.
    if (evt instanceof RegExp) {
      for (let key in events) {
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

    /*if (map !== undefined) {
      listeners = Object.keys(listeners).map(key => listeners[key]);
    }*/

    return listeners;
  },

  /**
   * Fetches the events object and creates one if required.
   *
   * @return {Object} The events storage object.
   * @api private
   */
  _getEvents: function() {
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

Draft.mixins.position = {
  position: function(x, y, z) {
    return this.prop({
      x: unit(x),
      y: unit(y),
      z: unit(z)
    });
  },

  pos: function() {
    return this.position.apply(this, arguments);
  },

  translate: function(x, y, z) {
    x = this.prop('x') + x || 0;
    y = this.prop('y') + y || 0;
    z = this.prop('z') + z || 0;

    return this.position(x, y, z);
  }
};

Draft.mixins.rotation = {
  rotation: function(α, β, γ) {
    return this.prop({
      α: α,
      β: β,
      γ: γ
    });
  },

  rot: function() {
    return this.rotation.apply(this, arguments);
  },

  rotate: function(α, β, γ) {
    α = this.prop('α') + α || 0;
    β = this.prop('β') + β || 0;
    γ = this.prop('γ') + γ || 0;

    return this.position(α, β, γ);
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

    // Make sure this._properties is initialized
    this._properties = {};
    this.prop('type', elementType(this));
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

  prop(prop, val) {
    // BACKLOG: test deleting all properties, perhaps remove it
    // Delete all properties if prop is null
    if (prop === null) {
      this._properties = {};
    }
    // Act as a full properties getter if prop is undefined
    else if (prop === undefined) {
      prop = {};

      for (let p in this._properties) {
        prop[p] = this._properties[p];
      }

      return prop;
    }
    // Act as a getter if prop is an object with only null values.
    // Act as a setter if prop is an object with at least one non-null value.
    else if (typeof prop == 'object') {
      let setter = false;

      for (let p in prop) {
        // Get this._properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter |= typeof prop[p] == 'object';
      }

      return setter ? this : prop;
    }
    // Delete the property if val is null
    else if (val === null) {
      delete this._properties[prop];
    }
    // Act as an individual property getter if val is undefined
    else if (val === undefined) {
      /*val = this._properties[prop];
      return val === undefined ? defaults[prop] || 0 : val;*/

      // FIXME: don't return 0
      // If prop is undefined, set it to the default OR 0
      return this._properties[prop] || defaults[prop] || 0;
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      // HACK:10 should use an actual unit data type, not just strings
      if (String(val).endsWith('_u')) {
        val = val.slice(0, -2);
        val = isFinite(val) ?
          val + this.parent.prop('units') || defaults.units : val;
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

      this.fire('change', [prop, val]); /*{
        // target: this,
        // type: this._properties.type,
        prop: prop,
        val: val
      });*/
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

// TODO: mixin to Draft.group
Draft.Container.mixin({
  group: function() {
    return this.add(new Draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

Draft.View = class View extends Draft.Element {
  /*render(renderer) {
    this['render' + renderer.toUpperCase()]();
  }*/
};

Draft.View.require('size');

Draft.Group.mixin({
  view: function(width, height) {
    return this.add(new Draft.View()).size(width, height).pos(0, 0);
  }
});

Draft.Page = class Page extends Draft.Group {};

Draft.Page.require('size');

Draft.Doc.mixin({
  page: function(name) {
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
  line: function(length) {
    return this.add(new Draft.Line()).length(length);
  }
});

Draft.Rect = class Rect extends Draft.Element {
  get rekt() {
    return Math.floor(Math.random() * 101) + '% rekt';
  }
};

Draft.Rect.require([
  'size',
  'radius'
]);

Draft.Group.mixin({
  rect: function(width, height) {
    return this.add(new Draft.Rect()).size(width, height);
  }
});

Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

Draft.Group.mixin({
  circle: function(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});

  return Draft;
}));