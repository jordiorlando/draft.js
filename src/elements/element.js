// Draft.Element =
Draft.Element = class Element {
  constructor(name) {
    // Make sure this.properties is initialized
    this.properties = {};
    this.dom = {};

    this.prop({
      name: name || null
    });
  }

  static extend(source) {
    return Draft.extend(this, source);
  }

  prop(prop, val) {
    // Act as a full properties getter if prop is null/undefined
    if (prop == null) {
      prop = {};

      for (let p in this.properties) {
        prop[p] = this.properties[p];
      }

      return prop;
    }
    // Act as a getter if prop is an object with only null values.
    // Act as a setter if prop is an object with at least one non-null value.
    else if (typeof prop === 'object') {
      let setter = false;

      for (let p in prop) {
        // Get this.properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter |= typeof prop[p] === 'object';
      }

      return setter ? this : prop;
    }
    // Delete the property if val is null
    else if (val === null) {
      delete this.properties[prop];
    }
    // Act as an individual property getter if val is undefined
    else if (val === undefined) {
      /*val = this.properties[prop];
      return val === undefined ? defaults[prop] || 0 : val;*/

      // If prop is undefined, set it to the default OR 0
      return this.properties[prop] ||
        this.prop(prop, defaults[prop] || 0);
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      // TODO: clean up this.parent.units()
      this.properties[prop] = prop !== 'id' && isFinite(val) ?
        val + this.parent.units() || defaults.units : val;

      var event = new CustomEvent('update', {
        detail: {
          element: this,
          type: this.properties.type,
          prop: prop,
          val: val
        },
        bubbles: true
      });

      this.node.dispatchEvent(event);
    }

    // prop() is chainable if 'this' is returned
    return this;
  }

  parent() {
    return this.parent;
  }
};

Draft.Element.extend([
  'size',
  'move'
]);
