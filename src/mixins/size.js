draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: draft.types.length(width),
      height: draft.types.length(height)
      // depth: draft.types.length(depth)
    });
  },

  scale(width = 1, height = 1) {
    return this.prop({
      width: draft.types.length(this.prop('width')) * width || undefined,
      height: draft.types.length(this.prop('height')) * height || undefined
      // depth: this.prop('depth') * depth || undefined
    });
  }
};
