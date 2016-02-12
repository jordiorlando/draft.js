draft.mixins.position = {
  // TODO: find better way of only applying supplied values
  position(x, y, z) {
    return this.prop({
      x: draft.types.length(x),
      y: draft.types.length(y),
      z: draft.types.length(z)
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
