draft.mixins.position = {
  position(x, y, z) {
    return this.prop({
      x: unit(x),
      y: unit(y),
      z: unit(z)
    });
  },

  pos(...args) {
    return this.position(...args);
  },

  translate(x, y, z) {
    x = this.prop('x') + x || 0;
    y = this.prop('y') + y || 0;
    z = this.prop('z') + z || 0;

    return this.position(x, y, z);
  }
};
