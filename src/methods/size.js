Draft.size = {
  // Get/set the element's width
  width: function (width) {
    return this.prop('width', width);
  },
  // Get/set the element's height
  height: function (height) {
    return this.prop('height', height);
  },
  // Get/set the element's width & height
  size: function (width, height) {
    return this.prop({
      width: width,
      height: height
    });
  }
};
