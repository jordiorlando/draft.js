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
    if (!this._type) {
      this._type = this.constructor.name;
    }
    // console.log('NAME:', this.constructor.name);
  }

  /* static inherit(source, addSuper) {
    draft.inherit(this, source, addSuper);
  } */

  static extend(name, config, parent) {
    var Class = class extends this {
      constructor() {
        super();

        /* if ('construct' in config) {
          super();
          // config.construct.call(this, ...args);
        } else {
          super(...args);
        } */
      }
      foo() {
        return 'foo';
      }
      get getter() {
        return 'get';
      }
    };

    Object.defineProperty(Class, 'name', {
      configurable: true,
      value: name
    });

    var mixin = (destination, source) => {
      for (let prop in source) {
        if (prop === 'static') {
          mixin(destination.constructor, source.static);
        } else if (prop !== 'construct') {
          let descriptor = Object.getOwnPropertyDescriptor(source, prop);
          descriptor.enumerable = false;

          // console.info(prop, descriptor);

          Object.defineProperty(destination, prop, descriptor);
        }
      }
    };

    mixin(Class.prototype, config);

    // console.log(`${name}:`, Class);

    if (parent !== null) {
      (parent || draft.Group).mixin({
        [name.toLowerCase()](...args) {
          var instance = this.append(new Class());
          if ('construct' in config) {
            config.construct.call(instance, ...args);
          }
          return instance;
        }
      });
    }

    return Class;
  }

  static extendSchema(name, config, parent) {
    var Class = class extends this {};

    Object.defineProperty(Class, 'name', {
      configurable: true,
      value: name
    });
    Class.schema = draft.proxy({
      has: {}
    });

    var merge = (destination, source) => {
      for (let prop in source) {
        let val = source[prop];

        if (val === null) {
          delete destination[prop];
          delete Class.schema.has[prop];
        } else if (typeof val == 'object' && !Array.isArray(val)) {
          /* if (destination[prop]) {
            merge(destination[prop], val);
          } else {
            destination[prop] = val;
          } */
          merge(destination[prop] || (destination[prop] = {}), val);

          if ('type' in val) {
            Class.schema.has[prop] = val.alias || [];
          }
        } else {
          destination[prop] = val;
        }
      }
    };
    if (typeof config.schema == 'object') {
      merge(Class.schema, this.schema || {});
      merge(Class.schema, config.schema);
    }

    var mixin = (destination, source) => {
      for (let prop in source) {
        let descriptor = Object.getOwnPropertyDescriptor(source, prop);
        descriptor.enumerable = false;
        Object.defineProperty(destination, prop, descriptor);
      }
    };
    if (typeof config.methods == 'object') {
      mixin(Class.prototype, config.methods);
    }

    console.log(`${name}:`, Class, 'schema:', Class.schema);

    if (parent !== null) {
      (parent || draft.Group).mixin({
        [name.substr(0, 1).toLowerCase() + name.substr(1)]() {
          var instance = this.append(new Class());
          return instance;
        }
      });
    }

    return Class;
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

  propSchema(prop, val) {
    var schema = this.constructor.schema;

    for (let name in schema.has) {
      if (prop === name || schema.has[name].includes(prop)) {
        return this.prop(name, val);
      }
    }
  }

  // Get/set the element's default length unit
  unit(unit) {
    return this.prop('unit', unit);
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
