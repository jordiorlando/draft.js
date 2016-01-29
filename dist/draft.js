/*
* draft.js - A lightweight library for parametric design
* version v0.0.5
* http://draft.D1SC0te.ch
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@hexa.io>
* license MIT
*
* BUILT: Fri Jan 29 2016 13:27:45 GMT-0600 (CST)
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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var draft = function draft(name) {
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
draft.px = function (val) {
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
function unit(val) {
  return val == null ? val : val + '_u';
}

// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

draft.inherit = function (destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
    destination._super = source.prototype;
  }
};

draft.mixin = function (destination, source) {
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
  on: function on(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];

      if (!listeners.map(function (l) {
        return l.listener;
      }).includes(listener)) {
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
      /* if (i > 0) {
        console.info(`${this.domID} ${key}:`, args);
      } */

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

draft.mixins.units = {
  // Get/set the element's measurement units

  units: function units(_units) {
    return this.prop('units', _units);
  }
};

draft.mixins.position = {
  // TODO: find better way of only applying supplied values

  position: function position(x, y, z) {
    return this.prop({
      x: unit(x),
      y: unit(y),
      z: unit(z)
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

draft.mixins.size = {
  // Get/set the element's width & height

  size: function size(width, height) {
    return this.prop({
      width: unit(width),
      height: unit(height)
    });
  },

  // Get/set the element's width
  width: function width(_width) {
    return draft.px(this.prop('width', unit(_width)));
  },

  // Get/set the element's height
  height: function height(_height) {
    return draft.px(this.prop('height', unit(_height)));
  }
};

draft.mixins.radius = {
  // Get/set the element's x radius

  rx: function rx(_rx) {
    return this.prop('rx', unit(_rx));
  },

  // Get/set the element's y radius
  ry: function ry(_ry) {
    return this.prop('ry', unit(_ry));
  },

  // Get/set the element's radius
  radius: function radius(rx, ry) {
    return this.prop({
      rx: unit(rx),
      ry: unit(ry)
    });
  }
};

// draft.Element =
draft.Element = (function () {
  function Element(name) {
    _classCallCheck(this, Element);

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

  _createClass(Element, [{
    key: 'prop',
    value: function prop(_prop, val) {
      if (_prop === null) {
        // BACKLOG: test deleting all properties, perhaps remove it
        // Delete all properties if prop is null
        this._properties = {};
      } else if (_prop === undefined) {
        // Act as a full properties getter if prop is undefined
        return Object(this._properties);
      } else if ((typeof _prop === 'undefined' ? 'undefined' : _typeof(_prop)) == 'object') {
        // Act as a getter if prop is an object with only null values.
        // Act as a setter if prop is an object with at least one non-null value.
        var setter = false;

        for (var p in _prop) {
          // Get this._properties[p] and save it to prop[p]
          _prop[p] = this.prop(p, _prop[p]);
          // If the returned value is an object, prop[p] is non-null, so act like
          // a setter.
          setter = setter || _typeof(_prop[p]) == 'object';
        }

        return setter ? this : _prop;
      } else if (val === null) {
        // Delete the property if val is null
        this.fire('change', [_prop, val]);
        delete this._properties[_prop];
      } else if (val === undefined) {
        // Act as an individual property getter if val is undefined

        // HACK: don't return 0?
        // If prop is undefined, set it to the default OR 0
        if (this._properties[_prop] === undefined) {
          this.prop(_prop, draft.defaults[_prop] || 0);
        }

        return this._properties[_prop];
      } else {
        // Act as an individual property setter if both prop and val are defined

        // HACK:10 should use an actual unit data type, not just strings
        if (String(val).endsWith('_u')) {
          val = val.slice(0, -2);
          val = isFinite(val) ? val + this.parent.prop('units') || draft.defaults.units : val;
        }

        this._properties[_prop] = val;

        this.fire('change', [_prop, val]);
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
          if (blacklist.includes(key)) {
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

draft.doc = function (name) {
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
      var _gcd = function gcd(a, b) {
        return b ? _gcd(b, a % b) : a;
      };

      _gcd = _gcd(this.width(), this.height());
      return this.width() / _gcd + ':' + this.height() / _gcd;
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
      return this.prop('length', unit(_length));
    }
  }]);

  return Line;
})(draft.Element);

draft.Group.mixin({
  line: function line(length) {
    return this.push(new draft.Line()).length(length);
  }
});

draft.Rect = (function (_draft$Element4) {
  _inherits(Rect, _draft$Element4);

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
})(draft.Element);

draft.Rect.require(['size', 'radius']);

draft.Group.mixin({
  rect: function rect() {
    var width = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    return this.push(new draft.Rect()).size(width, height);
  }
});

draft.Circle = (function (_draft$Element5) {
  _inherits(Circle, _draft$Element5);

  function Circle() {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).apply(this, arguments));
  }

  _createClass(Circle, [{
    key: 'radius',
    value: function radius(r) {
      return this.prop('r', unit(r));
    }
  }]);

  return Circle;
})(draft.Element);

draft.Group.mixin({
  circle: function circle() {
    var r = arguments.length <= 0 || arguments[0] === undefined ? 50 : arguments[0];

    return this.push(new draft.Circle()).radius(r);
  }
});
return draft;
}));
