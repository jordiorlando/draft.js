Draft.mixins.move = {
  /* // Get/set the element's x position
  x(x) {
    return this.prop('x', unit(x));
  },

  // Get/set the element's y position
  y(y) {
    return this.prop('y', unit(y));
  }, */

  // Get/set the element's position
  move() {
    var pos = {};
    for (var i = 0; i < arguments.length; i++) {
      pos[Draft.defaults[this.prop('system')].vars[i]] = unit(arguments[i]);
    }
    return this.prop(pos);
  }
};
