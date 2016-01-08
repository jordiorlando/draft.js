methods.radius = {
Draft.mixins.radius = {
  // Get/set the element's x radius
  rx: function(rx) {
    return this.prop('rx', rx);
  },
  // Get/set the element's y radius
  ry: function(ry) {
    return this.prop('ry', ry);
  },
  // Get/set the element's radius
  radius: function(rx, ry) {
    return this.prop({
      rx: rx,
      ry: ry
    });
  }
};
