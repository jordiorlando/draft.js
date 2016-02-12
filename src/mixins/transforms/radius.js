draft.mixins.radius = {
  // Get/set the element's x radius
  rx(rx) {
    return this.prop('rx', draft.types.length(rx));
  },
  // Get/set the element's y radius
  ry(ry) {
    return this.prop('ry', draft.types.length(ry));
  },
  // Get/set the element's radius
  radius(rx, ry) {
    return this.prop({
      rx: draft.types.length(rx),
      ry: draft.types.length(ry)
    });
  }
};
