draft.mixins.move = {
  /* // Get/set the element's x position
  x(x) {
    return this.prop('x', unit(x));
  },

  // Get/set the element's y position
  y(y) {
    return this.prop('y', unit(y));
  }, */

  // Get/set the element's position
  move(...args) {
    var pos = {};
    for (var i in args) {
      pos[draft.defaults[this.prop('system')].vars[i]] = unit(args[i]);
    }
    return this.prop(pos);
  }
};
