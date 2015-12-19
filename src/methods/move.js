Draw.move = {
  inherit: [
    Draw.attr
  ],
  // Get/set the element's x position
  x: function (x) {
    return this.attr('x', x);
  },

  // Get/set the element's y position
  y: function (y) {
    return this.attr('y', y);
  },

  // Get/set the element's position
  move: function (x, y) {
    return this.attr({
      x: x,
      y: y
    });
  }
};
