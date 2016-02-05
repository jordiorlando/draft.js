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

        // HACK:10 should use an actual unit data type, not just strings
        if (String(val).endsWith('_u')) {
          val = val.slice(0, -2);
          val = isFinite(val) ?
            val + this.parent.prop('units') || draft.defaults.units : val;
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
