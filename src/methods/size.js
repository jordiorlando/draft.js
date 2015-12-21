Draw.size = {
  require: [
    Draw.attr
  ],
  
  // Get/set the element's width
  width: function (width) {
    return this.attr('width', width);
  },
  // Get/set the element's height
  height: function (height) {
    return this.attr('height', height);
  },
  // Get/set the element's width & height
  size: function (width, height) {
    return this.attr({
      width: width,
      height: height
    });
  }
};
