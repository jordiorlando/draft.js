Draft.mixins.move = {
  /*// Get/set the element's x position
  x: function(x) {
    return this.prop('x', unit(x));
  },

  // Get/set the element's y position
  y: function(y) {
    return this.prop('y', unit(y));
  },*/

  // Get/set the element's position
  move: function() {
    var pos = {};
    for (var i = 0; i < arguments.length; i++) {
      pos[Draft.defaults[this.prop('system')].vars[i]] = unit(arguments[i]);
    }
    return this.prop(pos);
  }
};
