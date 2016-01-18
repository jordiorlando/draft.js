// draft.Element =
draft.Element = class Element {
  constructor() {
    // DOING:10 create DOM node
    this.dom = {};
    this.dom.node = document.createElement('object');
    // Store a circular reference in the node
    this.dom.node.element = this;

    // Make sure this._properties is initialized
    this._properties = {};

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

  // Construct a unique ID from the element's type and ID
  get domID() {
    var id = String(this.id);
    while (id.length < 4) {
      id = `0${id}`;
    }

    return `draft_${this.type}_${id}`;
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

      // TODO: don't return 0?
      // If prop is undefined, set it to the default OR 0
      if (!this._properties[prop]) {
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
