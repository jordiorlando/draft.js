draft.Element = class Element {
  constructor(name) {
    // Make sure _metadata and _properties are initialized
    this._metadata = {
      name: name
    };
    this._properties = {};

    // HACK:0 use this.constructor.name to get an element's type. Requires all
    // subclasses to have a defined constructor.
    for (let type in draft) {
      if (this.constructor === draft[type]) {
        this._type = type.toLowerCase();
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

  static require(source) {
    this.mixin(source);
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

    // TODO: make the domID digit length configurable
    while (id.length < 4) {
      id = `0${id}`;
    }

    return `${this.type}_${id}`;
  }

  get meta() {
    return this._metadata;
  }

  prop(prop, val, obj = this._properties) {
    if (prop === undefined) {
      // Act as a full properties getter if prop is undefined
      return this._properties;
    } else if (prop === null) {
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

        // TODO: let properties be objects (don't stringify)
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

draft.Element.require([
  'event',
  'position',
  'rotation'
]);
