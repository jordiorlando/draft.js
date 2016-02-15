draft.mixins.fill = {
  // TODO: combine color and opacity into fill()
  fill(color) {
    return this.fillColor(color);
  },

  fillColor(color) {
    return this.prop('fill.color', draft.types.color(color));
  },

  fillOpacity(opacity) {
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('fill.opacity', opacity);
  }
};

draft.defaults['fill.color'] = '#fff';
draft.defaults['fill.opacity'] = 0;
