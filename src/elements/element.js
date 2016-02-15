// let _type = new WeakMap();
// let _id = new WeakMap();

draft.Element = class Element {
  constructor(name) {
    // Make sure _metadata and _properties are initialized
    this._metadata = {
      name: name
    };
    this._properties = {};
    this.transforms = [];

    // HACK:0 use this.constructor.name to get an element's type. Requires all
    // subclasses to have a defined constructor.
    for (let type in draft) {
      if (this.constructor === draft[type]) {
        this._type = type.toLowerCase();
        // _type.set(this, type.toLowerCase());
        break;
      }
    }
    // console.log('TYPE:', this.type, 'NAME:', this.constructor.name);
  }

  static inherit(source, addSuper) {
    draft.inherit(this, source, addSuper);
  }

  static mixin(source) {
    draft.mixin(this, source);
  }

  get type() {
    return this._type;
    // return _type.get(this);
  }

  get id() {
    return this._id;
    // return _id.get(this);
  }

  // Construct a unique ID from the element's type and ID
  get domID() {
    var id = String(this.id);

    // TODO: make the domID digit length configurable
    return `${this.type}_${'0'.repeat(Math.max(4 - id.length, 0))}${id}`;
  }

  get meta() {
    return this._metadata;
  }

  prop(prop, val) {
    if (prop === undefined) {
      // Act as a full properties getter if prop is undefined
      return this._properties;
    } else if (prop === null) {
      // Delete all properties if prop is null
      this._properties = {};
    } else if (typeof prop == 'string') {
      var props = draft.proxy(this._properties);

      if (val === undefined) {
        // Act as an individual property getter if val is undefined
        // TODO: do a fuzzy-find? For example, el.prop('width') would match
        // el._properties.size.width if el._properties.width is undefined
        return prop in props ? props[prop] : null;
      } else if (val === null) {
        // Delete the property if val is null
        delete props[prop];
        this.fire('change', [prop, val]);
      } else if (props[prop] !== val) {
        // Act as an individual property setter if both prop and val are defined

        // TODO: let properties be objects (don't stringify)
        if (val.type === 'color') {
          val = String(val);
        }

        props[prop] = val;
        this.fire('change', [prop, val]);
      }
    } else if (typeof prop == 'object') {
      // Act as a getter if prop is an object with only null values.
      // Act as a setter if prop is an object with at least one non-null value.
      let setter = false;

      for (let p in prop) {
        // Get this._properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter = setter || typeof prop[p] == 'object';
      }

      return setter ? this : prop;
    }

    // Chainable if 'this' is returned
    return this;
  }

  // TODO: use rest (...blacklist) for multiple blacklist items?
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

draft.Element.mixin([
  'event',
  'transform'
]);
