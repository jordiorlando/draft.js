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
  var access = function access(target, prop) {
    if (typeof prop === 'string') {
      return access(target, prop.split('.'));
    }

    var p = prop.shift();

    if (prop.length > 0) {
      return access(target[p] || (target[p] = {}), prop);
    }

    return [target, p];
  };

  var handler = {
    get: function get(target, prop) {
      var _access = access(target, prop);

      var _access2 = _slicedToArray(_access, 2);

      var t = _access2[0];
      var p = _access2[1];

      return t[p];
    },
    set: function set(target, prop, val) {
      var _access3 = access(target, prop);

      var _access4 = _slicedToArray(_access3, 2);

      var t = _access4[0];
      var p = _access4[1];

      t[p] = val;
      return true;
    },
    deleteProperty: function deleteProperty(target, prop) {
      var _access5 = access(target, prop);

      var _access6 = _slicedToArray(_access5, 2);

      var t = _access6[0];
      var p = _access6[1];

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
  var units = regex.exec(val) === null ? false : val.slice(regex.lastIndex) || 'px';

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
  return val == null ? val : val + '_u';
}

draft.types.color = function color(val) {
  var hex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

  var rgb255 = '([01]?\\d\\d?|2[0-4]\\d|25[0-5])';
  var rgb = new RegExp('^rgb\\(' + rgb255 + '\\, ?' + rgb255 + '\\, ?' + rgb255 + '\\)$', 'i');

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

      // NOTE: fire event
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
      x: unitHack(x),
      y: unitHack(y),
      z: unitHack(z)
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
    return this.prop('fill.opacity', draft.types.opacity(opacity));
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
    return this.prop('stroke.opacity', draft.types.opacity(opacity));
  },
  strokeWidth: function strokeWidth(width) {
    return this.prop('stroke.width', draft.types.unit(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;

draft.mixins.size = {
  // Get/set the element's width & height

  size: function size(width, height) {
    return this.prop({
      width: unitHack(width),
      height: unitHack(height)
    });
  },

  // Get/set the element's width
  width: function width(_width) {
    return draft.px(this.prop('width', unitHack(_width)));
  },

  // Get/set the element's height
  height: function height(_height) {
    return draft.px(this.prop('height', unitHack(_height)));
  }
};

draft.mixins.radius = {
  // Get/set the element's x radius

  rx: function rx(_rx) {
    return this.prop('rx', unitHack(_rx));
  },

  // Get/set the element's y radius
  ry: function ry(_ry) {
    return this.prop('ry', unitHack(_ry));
  },

  // Get/set the element's radius
  radius: function radius(rx, ry) {
    return this.prop({
      rx: unitHack(rx),
      ry: unitHack(ry)
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

          // HACK: don't return 0?
          // If prop is undefined, set it to the default OR 0
          if (props[_prop] === undefined) {
            this.prop(_prop, draft.defaults[_prop] || 0);
          }

          return props[_prop];
        } else if (val === null) {
          // Delete the property if val is null
          delete props[_prop];
        } else {
          // Act as an individual property setter if both prop and val are defined

          // HACK:10 should use an actual unit data type, not just strings
          if (String(val).endsWith('_u')) {
            val = val.slice(0, -2);
            val = isFinite(val) ? val + this.parent.prop('units') || draft.defaults.units : val;
          }

          props[_prop] = val;
        }

        this.fire('change', [_prop, val]);
      } else if ((typeof _prop === 'undefined' ? 'undefined' : _typeof(_prop)) == 'object') {
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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, name));

    _this.children = [];
    return _this;
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

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Doc).call(this, name));

    _this2.elements = {};

    _this2.prop({
      system: draft.defaults.system,
      units: draft.defaults.units
    });
    return _this2;
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
      var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
      };

      gcd = gcd(this.width(), this.height());
      return this.width() / gcd + ':' + this.height() / gcd;
    }
  }]);

  return View;
})(draft.Element);

draft.View.require('size');

draft.Group.mixin({
  view: function view(width, height) {
    return this.push(new draft.View()).size(width, height);
  }
});

draft.Line = (function (_draft$Element3) {
  _inherits(Line, _draft$Element3);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Line).apply(this, arguments));
  }

  _createClass(Line, [{
    key: 'length',
    value: function length(_length) {
      return this.prop('length', unitHack(_length));
    }
  }]);

  return Line;
})(draft.Element);

draft.Line.require('stroke');

draft.Group.mixin({
  line: function line(length) {
    return this.push(new draft.Line()).length(length);
  }
});

draft.Shape = (function (_draft$Element4) {
  _inherits(Shape, _draft$Element4);

  function Shape() {
    _classCallCheck(this, Shape);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Shape).apply(this, arguments));
  }

  return Shape;
})(draft.Element);

draft.Shape.require(['fill', 'stroke', 'size']);

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

draft.Rect.require(['radius']);

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
      return this.prop('r', unitHack(r));
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
