draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: draft.types.length(width),
      height: draft.types.length(height)
      // depth: draft.types.length(depth)
    });
  }
};
