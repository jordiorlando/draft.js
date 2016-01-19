draft.mixins.size = {
  // Get/set the element's width & height
  size(width, height) {
    return this.prop({
      width: unit(width),
      height: unit(height)
    });
  },
  // Get/set the element's width
  width(width) {
    return draft.px(this.prop('width', unit(width)));
  },
  // Get/set the element's height
  height(height) {
    return draft.px(this.prop('height', unit(height)));
  }
};
