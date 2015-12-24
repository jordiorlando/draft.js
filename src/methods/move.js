Draft.move = {
  require: [
    Draft.prop
  ],
  // Get/set the element's x position
  x: function (x) {
    return this.prop('x', x);
  },

  // Get/set the element's y position
  y: function (y) {
    return this.prop('y', y);
  },

  // Get/set the element's position
  move: function (x, y) {
    return this.prop({
      x: x,
      y: y
    });
  }
};
