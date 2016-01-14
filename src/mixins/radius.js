draft.mixins.radius = {
  // Get/set the element's x radius
  rx(rx) {
    return this.prop('rx', unit(rx));
  },
  // Get/set the element's y radius
  ry(ry) {
    return this.prop('ry', unit(ry));
  },
  // Get/set the element's radius
  radius(rx, ry) {
    return this.prop({
      rx: unit(rx),
      ry: unit(ry)
    });
  }
};
