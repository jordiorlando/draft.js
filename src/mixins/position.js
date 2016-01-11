Draft.mixins.position = {
  position: function(x, y, z) {
    return this.prop({
      x: unit(x),
      y: unit(y),
      z: unit(z)
    });
  },

  pos: function() {
    return this.position(arguments);
  }
};
