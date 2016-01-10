Draft.mixins.position = {
  position: function(x, y, z) {
    return this.prop({
      x: unit(x),
      y: unit(y),
      z: unit(z)
    });
  },

  pos: function(x, y, z) {
    return this.position(x, y, z);
  }
};
