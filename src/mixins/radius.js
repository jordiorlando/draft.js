draft.mixins.radius = {
  // Get/set the element's x radius
  rx(rx) {
    return this.prop('rx', unitHack(rx));
  },
  // Get/set the element's y radius
  ry(ry) {
    return this.prop('ry', unitHack(ry));
  },
  // Get/set the element's radius
  radius(rx, ry) {
    return this.prop({
      rx: unitHack(rx),
      ry: unitHack(ry)
    });
  }
};
