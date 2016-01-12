Draft.mixins.size = {
  // Get/set the element's width
  width: function(width) {
    return this.prop('width', unit(width));
  },
  // Get/set the element's height
  height: function(height) {
    return this.prop('height', unit(height));
  },
  // Get/set the element's width & height
  size: function(width, height) {
    return this.prop({
      width: unit(width),
      height: unit(height)
    });
  }
};
