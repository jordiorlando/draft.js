Draw.prop = {
  prop: function (prop, val) {
    // Make sure this.properties is initialized
    this.properties = this.properties || {};

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
    // Act as an individual property getter if val is null/undefined
    else if (val == null) {
      val = this.properties[prop];
      return val == null ? Draw.defaults[prop] : val;
    }
    // Act as an individual property setter if both prop and val are defined
    else {
      this.properties[prop] = val;
    }

    updateDOM(this);
    
    // prop() is chainable if 'this' is returned
    return this;
  }
};
