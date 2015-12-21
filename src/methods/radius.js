Draw.radius = {
  require: [
    Draw.attr
  ],
  // Get/set the element's x radius
  rx: function (rx) {
    return this.attr('rx', rx);
  },
  // Get/set the element's y radius
  ry: function (ry) {
    return this.attr('ry', ry);
  },
  // Get/set the element's radius
  radius: function (rx, xy) {
    return this.attr({
      rx: rx,
      ry: ry
    });
  }
};
