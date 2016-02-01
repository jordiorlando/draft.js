draft.mixins.stroke = {
  // TODO: combine color, opacity, and width into stroke()
  stroke(color) {
    return this.strokeColor(color);
  },

  strokeColor(color) {
    return this.prop('stroke.color', draft.types.color(color));
  },

  strokeOpacity(opacity) {
    return this.prop('stroke.opacity', draft.types.opacity(opacity));
  },

  strokeWidth(width) {
    return this.prop('stroke.width', draft.types.unit(width));
  }
};
