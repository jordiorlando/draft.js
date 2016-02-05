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
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

draft.proxy = function proxy(obj) {
  var setInit = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var access = function access(target, prop, init) {
    if (typeof prop === 'string') {
      return access(target, prop.split('.'), init);
    }

    var p = prop.shift();

    if (prop.length && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && (init || p in target)) {
      // TODO: when init is false, setting obj['foo.bar'] will incorrectly set
      // obj['foo'] instead
      return access(p in target ? target[p] : target[p] = {}, prop, init);
    }

    return [target, p];
  };

  // TODO: return null if the property does not exist or was not set/deleted?
  var handler = {
    has: function has(target, prop) {
      var _access = access(target, prop);

      var _access2 = _slicedToArray(_access, 2);

      var t = _access2[0];
      var p = _access2[1];

      return !!t[p];
    },
    get: function get(target, prop) {
      var _access3 = access(target, prop);

      var _access4 = _slicedToArray(_access3, 2);

      var t = _access4[0];
      var p = _access4[1];

      return t[p];
    },
    set: function set(target, prop, val) {
      var _access5 = access(target, prop, setInit);

      var _access6 = _slicedToArray(_access5, 2);

      var t = _access6[0];
      var p = _access6[1];

      t[p] = val;
      return true;
    },
    deleteProperty: function deleteProperty(target, prop) {
      var _access7 = access(target, prop);

      var _access8 = _slicedToArray(_access7, 2);

      var t = _access8[0];
      var p = _access8[1];

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

draft.types.Float = (function () {
  function Float(value) {
    _classCallCheck(this, Float);

    this.value = parseFloat(value);
  }

  _createClass(Float, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.value;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'float';
    }
  }, {
    key: 'regex',
    get: function get() {
      // Matches all floating point values. Should match:
      // 123
      // -123.45
      // 123e5
      // 123.45E+5
      return '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?';
    }
  }]);

  return Float;
})();

draft.types.float = function float(value) {
  return value == undefined ? value : new draft.types.Float(value);
};

var test = function test(val, regex) {
  // TODO: strict match anchor (^ instead of word end)
  regex = new RegExp(regex + '$', 'i');
  val = regex.exec(val);
  return val ? val[0].toLowerCase() : false;
};

draft.types.Length = (function (_draft$types$Float) {
  _inherits(Length, _draft$types$Float);

  function Length(value, unit) {
    _classCallCheck(this, Length);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Length).call(this, value));

    value = test(value, _this.regex);
    unit = test(unit, _this.regex);

    if (!isNaN(_this.value) && (value || unit)) {
      _this.unit = value || unit;
      _this.convert(unit);
    } else {
      _this.unit = '';
    }
    return _this;
  }

  _createClass(Length, [{
    key: 'convert',
    value: function convert(newUnit) {
      var _this2 = this;

      newUnit = test(newUnit, this.regex);

      if (!newUnit) {
        return false;
      }

      var chain = function chain(unit, reverse) {
        var units = _this2.units[unit];

        _this2.value *= reverse ? units[1] : units[0];
        _this2.value /= reverse ? units[0] : units[1];

        return units[2];
      };

      var unit = this.unit;
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
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return new Length(this.toString(), draft.defaults.units).value;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.value + this.unit;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'length';
    }
  }, {
    key: 'regex',
    get: function get() {
      return '(px|pt|pc|in|ft|yd|mi|mm|cm|dm|km|m)';
    }
  }, {
    key: 'units',
    get: function get() {
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
  }]);

  return Length;
})(draft.types.Float);

draft.types.length = function length(value, unit) {
  return value == undefined ? value : new draft.types.Length(value, unit);
};

draft.types.Color = (function () {
  function Color(color) {
    _classCallCheck(this, Color);

    color = new RegExp('^(?:' + this.regex + ')$', 'i').exec(isNaN(color) ? color : color.toString(16));

    if (color !== null) {
      this.color = color[0].toLowerCase();

      for (var i = 1; i <= 3; i++) {
        color[i] = parseInt(color[i] || parseInt(color[i + 3] || color[i + 6].repeat(2), 16), 10);
      }

      this.red = color[1];
      this.green = color[2];
      this.blue = color[3];
    }
  }

  _createClass(Color, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.red << 16 | this.green << 8 | this.blue;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.color;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'color';
    }
  }, {
    key: 'regex',
    get: function get() {
      var rgbColor = '([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])';
      var rgb = 'rgb\\(' + rgbColor + ', ?' + rgbColor + ', ?' + rgbColor + '\\)';

      var hexColor = '([0-9a-f]{2})'.repeat(3);
      var hex = '#?(?:' + hexColor + '|' + hexColor.replace(/\{2\}/g, '') + ')';
      // var hex = '#?(?:[0-9a-f]{3}){1,2}';

      return rgb + '|' + hex;
    }
  }]);

  return Color;
})();

draft.types.color = function color(value) {
  return value == undefined ? value : new draft.types.Color(value);
};

// These methods are adapted from Oliver Caldwell's EventEmitter library, which
// he has released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/EventEmitter

// BACKLOG: implement bubbling?

draft.mixins.event = {
  on: function on(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];

      if (!(listeners.map(function (l) {
        return l.listener;
      }).indexOf(listener) !== -1)) {
        listeners.push((typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object' ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  },
  once: function once(evt, listener) {
    return this.on(evt, {
      listener: listener,
      once: true
    });
  },
  off: function off(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var index = listeners.map(function (l) {
        return l.listener;
      }).lastIndexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }

    return this;
  },

  // TODO: use rest for args (...args)
  fire: function fire(evt, args) {
    // Put args in an array if it isn't already one
    if (!Array.isArray(args)) {
      args = [args];
    }

    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var i = listeners.length;

      if (i > 0) {}

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
  defineEvent: function defineEvent() {
    for (var _len = arguments.length, evts = Array(_len), _key = 0; _key < _len; _key++) {
      evts[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = evts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var evt = _step.value;

        this.getListeners(evt);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return this;
  },
  removeEvent: function removeEvent(evt) {
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
  getListeners: function getListeners(evt, map) {
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
  _getEvents: function _getEvents() {
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

  system: function system(_system) {
    /* if (this.prop('system') != system) {
      // BACKLOG:20 recursively convert all elements to new system?
    } */
    return this.prop('system', _system);
  }
};

draft.defaults.system = 'cartesian';

draft.mixins.units = {
  // Get/set the element's measurement units

  units: function units(_units) {
    return this.prop('units', _units);
  }
};

draft.defaults.units = 'px';

draft.mixins.position = {
  // TODO: find better way of only applying supplied values

  position: function position(x, y, z) {
    return this.prop({
      x: draft.types.length(x),
      y: draft.types.length(y),
      z: draft.types.length(z)
    });
  },
  pos: function pos() {
    return this.position.apply(this, arguments);
  },
  translate: function translate(x, y, z) {
    x = this.prop('x') + x || 0;
    y = this.prop('y') + y || 0;
    z = this.prop('z') + z || 0;

    return this.position(x, y, z);
  }
};

draft.mixins.rotation = {
  rotation: function rotation(α, β, γ) {
    return this.prop({
      α: α,
      β: β,
      γ: γ
    });
  },
  rot: function rot() {
    return this.rotation.apply(this, arguments);
  },
  rotate: function rotate(α, β, γ) {
    α = this.prop('α') + α || 0;
    β = this.prop('β') + β || 0;
    γ = this.prop('γ') + γ || 0;

    return this.position(α, β, γ);
  }
};

draft.mixins.fill = {
  // TODO: combine color and opacity into fill()

  fill: function fill(color) {
    return this.fillColor(color);
  },
  fillColor: function fillColor(color) {
    return this.prop('fill.color', draft.types.color(color));
  },
  fillOpacity: function fillOpacity(opacity) {
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

  stroke: function stroke(color) {
    return this.strokeColor(color);
  },
  strokeColor: function strokeColor(color) {
    return this.prop('stroke.color', draft.types.color(color));
  },
  strokeOpacity: function strokeOpacity(opacity) {
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('stroke.opacity', opacity);
  },
  strokeWidth: function strokeWidth(width) {
    return this.prop('stroke.width', draft.types.length(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;

draft.mixins.size = {
  // Get/set the element's width & height

  size: function size(width, height) {
    return this.prop({
      width: draft.types.length(width),
      height: draft.types.length(height)
      // depth: draft.types.length(depth)
    });
  },
  scale: function scale(width, height) {
    return this.prop({
      width: this.prop('width') * width || undefined,
      height: this.prop('height') * height || undefined
      // depth: this.prop('depth') * depth || undefined
    });
  }
};

draft.mixins.radius = {
  // Get/set the element's x radius

  rx: function rx(_rx) {
    return this.prop('rx', draft.types.length(_rx));
  },

  // Get/set the element's y radius
  ry: function ry(_ry) {
    return this.prop('ry', draft.types.length(_ry));
  },

  // Get/set the element's radius
  radius: function radius(rx, ry) {
    return this.prop({
      rx: draft.types.length(rx),
      ry: draft.types.length(ry)
    });
  }
};

draft.Element = (function () {
  function Element(name) {
    _classCallCheck(this, Element);

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

  _createClass(Element, [{
    key: 'prop',
    value: function prop(_prop, val) {
      var obj = arguments.length <= 2 || arguments[2] === undefined ? this._properties : arguments[2];

      if (_prop === undefined) {
        // Act as a full properties getter if prop is undefined
        // TODO: don't create a new object?
        return Object(this._properties);
      } else if (_prop === null) {
        // BACKLOG: test deleting all properties, perhaps remove it
        // Delete all properties if prop is null
        this._properties = {};
      } else if (typeof _prop === 'string') {
        var props = draft.proxy(this._properties);

        if (val === undefined) {
          // Act as an individual property getter if val is undefined
          // TODO: do a fuzzy-find? For example, el.prop('width') would match
          // el._properties.size.width if el._properties.width is undefined
          return _prop in props ? props[_prop] : null;
        } else if (val === null) {
          // Delete the property if val is null
          delete props[_prop];
        } else {
          // Act as an individual property setter if both prop and val are defined

          if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            var unit = undefined;

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

          props[_prop] = val;
        }

        this.fire('change', [_prop, val]);
      } else if ((typeof _prop === 'undefined' ? 'undefined' : _typeof(_prop)) === 'object') {
        // Act as a getter if prop is an object with only null values.
        // Act as a setter if prop is an object with at least one non-null value.
        var setter = false;

        for (var p in _prop) {
          // Get this._properties[p] and save it to prop[p]
          _prop[p] = this.prop(p, _prop[p], obj);
          // If the returned value is an object, prop[p] is non-null, so act like
          // a setter.
          setter = setter || _typeof(_prop[p]) == 'object';
        }

        return setter ? this : _prop;
      }

      // Chainable if 'this' is returned
      return this;
    }

    // TODO: use rest (...blacklist)

  }, {
    key: 'stringify',
    value: function stringify(blacklist) {
      var replacer;

      if (Array.isArray(blacklist)) {
        replacer = function (key, val) {
          if (blacklist.indexOf(key) !== -1) {
            return undefined;
          }

          return val;
        };
      } else if (blacklist instanceof RegExp) {
        replacer = function (key, val) {
          if (blacklist.test(key)) {
            return undefined;
          }

          return val;
        };
      }

      return JSON.stringify(this, replacer, 2);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        type: this.type,
        id: this.id,
        properties: this.prop(),
        children: this.children
      };
    }
  }, {
    key: 'type',
    get: function get() {
      return this._type;
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    }
  }, {
    key: 'name',
    get: function get() {
      return this.prop('name');
    }

    // Construct a unique ID from the element's type and ID

  }, {
    key: 'domID',
    get: function get() {
      var id = String(this.id);
      while (id.length < 4) {
        id = '0' + id;
      }

      return this.type + '_' + id;
    }
  }], [{
    key: 'inherit',
    value: function inherit(source, addSuper) {
      draft.inherit(this, source, addSuper);
    }
  }, {
    key: 'mixin',
    value: function mixin(source) {
      draft.mixin(this, source);
    }

    // TODO:40 merge require() with mixin()?

  }, {
    key: 'require',
    value: function require(source) {
      if (typeof source == 'string') {
        this.mixin(draft.mixins[source]);
      } else if (Array.isArray(source)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = source[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var mixin = _step2.value;

            this.require(mixin);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }
  }]);

  return Element;
})();

draft.Element.require(['event', 'position', 'rotation']);

draft.Container = (function (_draft$Element) {
  _inherits(Container, _draft$Element);

  function Container(name) {
    _classCallCheck(this, Container);

    // Initialize children array

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, name));

    _this3.children = [];
    return _this3;
  }

  _createClass(Container, [{
    key: 'add',
    value: function add(child) {
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
  }, {
    key: 'push',
    value: function push(child) {
      this.add(child);
      return child;
    }
  }, {
    key: 'remove',
    value: function remove(child) {
      this.fire('remove', [child]);
      return this;
    }
  }, {
    key: 'firstChild',
    get: function get() {
      return this.children[0];
    }
  }, {
    key: 'lastChild',
    get: function get() {
      return this.children[this.children.length - 1];
    }
  }]);

  return Container;
})(draft.Element);

draft.Doc = (function (_draft$Container) {
  _inherits(Doc, _draft$Container);

  function Doc(name) {
    _classCallCheck(this, Doc);

    // Initialize elements container

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Doc).call(this, name));

    _this4.elements = {};

    _this4.prop({
      system: draft.defaults.system,
      units: draft.defaults.units
    });
    return _this4;
  }

  return Doc;
})(draft.Container);

draft.doc = function doc(name) {
  var newDoc = new draft.Doc(name);

  (draft.docs || (draft.docs = [])).push(newDoc);
  newDoc._id = draft.docs.length;

  return newDoc;
};

draft.Group = (function (_draft$Container2) {
  _inherits(Group, _draft$Container2);

  function Group() {
    _classCallCheck(this, Group);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Group).apply(this, arguments));
  }

  return Group;
})(draft.Container);

draft.Group.require(['system', 'units']);

// TODO: mixin to draft.Group?
draft.Container.mixin({
  group: function group(name) {
    return this.push(new draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});

draft.View = (function (_draft$Element2) {
  _inherits(View, _draft$Element2);

  function View() {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
  }

  _createClass(View, [{
    key: 'aspectRatio',

    /* render(renderer) {
      this['render' + renderer.toUpperCase()]();
    } */

    get: function get() {
      var width = draft.types.length(this.prop('width')).value;
      var height = draft.types.length(this.prop('height')).value;

      var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
      };

      gcd = gcd(width, height);
      return width / gcd + ':' + height / gcd;
    }
  }]);

  return View;
})(draft.Element);

draft.View.require('size');

draft.Group.mixin({
  // TODO: get group bounding box for default size

  view: function view() {
    var width = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    return this.push(new draft.View()).size(width, height);
  }
});

draft.Point = (function (_draft$Element3) {
  _inherits(Point, _draft$Element3);

  function Point() {
    _classCallCheck(this, Point);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Point).apply(this, arguments));
  }

  return Point;
})(draft.Element);

draft.Point.require('stroke');

draft.Group.mixin({
  point: function point() {
    return this.push(new draft.Point());
  }
});

draft.Line = (function (_draft$Point) {
  _inherits(Line, _draft$Point);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Line).apply(this, arguments));
  }

  _createClass(Line, [{
    key: 'length',
    value: function length(_length) {
      return this.prop('length', draft.types.length(_length));
    }
  }]);

  return Line;
})(draft.Point);

draft.Group.mixin({
  line: function line() {
    var length = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

    return this.push(new draft.Line()).length(length);
  }
});

draft.Shape = (function (_draft$Point2) {
  _inherits(Shape, _draft$Point2);

  function Shape() {
    _classCallCheck(this, Shape);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Shape).apply(this, arguments));
  }

  return Shape;
})(draft.Point);

draft.Shape.require(['fill', 'size']);

draft.Rect = (function (_draft$Shape) {
  _inherits(Rect, _draft$Shape);

  function Rect() {
    _classCallCheck(this, Rect);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Rect).apply(this, arguments));
  }

  _createClass(Rect, [{
    key: 'rekt',

    // Hehehe
    get: function get() {
      return Math.floor(Math.random() * 101) + '% rekt';
    }
  }]);

  return Rect;
})(draft.Shape);

draft.Rect.require('radius');

draft.Group.mixin({
  rect: function rect() {
    var width = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    return this.push(new draft.Rect()).size(width, height);
  }
});

draft.Circle = (function (_draft$Shape2) {
  _inherits(Circle, _draft$Shape2);

  function Circle() {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).apply(this, arguments));
  }

  _createClass(Circle, [{
    key: 'radius',
    value: function radius(r) {
      return this.prop('r', draft.types.length(r));
    }
  }]);

  return Circle;
})(draft.Shape);

draft.Group.mixin({
  circle: function circle() {
    var r = arguments.length <= 0 || arguments[0] === undefined ? 50 : arguments[0];

    return this.push(new draft.Circle()).radius(r);
  }
});
return draft;
}));
