draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: draft.types.length(width),
      height: draft.types.length(height)
      // depth: draft.types.length(depth)
    });
  },
  // Get/set the element's width
  width(width) {
    return draft.px(this.prop('width', unitHack(width)));
  },
  // Get/set the element's height
  height(height) {
    return draft.px(this.prop('height', unitHack(height)));
  }
};
