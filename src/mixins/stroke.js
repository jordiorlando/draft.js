draft.mixins.stroke = {
  // TODO: combine color, opacity, and width into stroke()
  stroke(color) {
    return this.strokeColor(color);
  },

  strokeColor(color) {
    return this.prop('stroke.color', draft.types.color(color));
  },

  strokeOpacity(opacity) {
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('stroke.opacity', opacity);
  },

  strokeWidth(width) {
    return this.prop('stroke.width', draft.types.length(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;
