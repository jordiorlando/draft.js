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

    // HACK:0 need a better way of getting an element's type
    for (var type in Draft) {
      if (this.constructor === Draft[type]) {
        this.prop('type', type.toLowerCase());
        break;
      }
    }
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

  get type() {
    return this.prop('type');
  }

  get id() {
    return this.prop('id');
  }

  // Construct a unique ID from the element's type and ID
  get domID() {
    var id = String(this.id);
    while (id.length < 4) {
      id = `0${id}`;
    }

    return [
      'DraftJS',
      this.type,
      id
    ].join('_');
  }

  prop(prop, val) {
    // BACKLOG: test deleting all properties, perhaps remove it
    // Delete all properties if prop is null
    if (prop === null) {
      this._properties = {};
    }
    // Act as a full properties getter if prop is undefined
    else if (prop === undefined) {
    }
    // Act as a getter if prop is an object with only null values.
    // Act as a setter if prop is an object with at least one non-null value.
    else if (typeof prop == 'object') {
      return new Object(this._properties);
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
    // Delete the property if val is null
    else if (val === null) {
      delete this._properties[prop];
    }
    // Act as an individual property getter if val is undefined
    else if (val === undefined) {
      /*val = this._properties[prop];
      return val === undefined ? defaults[prop] || 0 : val;*/

      // TODO: don't return 0?
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      // If prop is undefined, set it to the default OR 0
      return this._properties[prop] ||
        (this._properties[prop] = Draft.defaults[prop] || 0);
      // HACK:10 should use an actual unit data type, not just strings
      if (String(val).endsWith('_u')) {
        val = val.slice(0, -2);
        val = isFinite(val) ?
          val + this.parent.prop('units') || Draft.defaults.units : val;
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
