draft.mixins.fill = {
  // TODO: combine color and opacity into fill()
  fill(color) {
    return this.fillColor(color);
  },

  fillColor(color) {
    return this.prop('fill.color', draft.types.color(color));
  },

  fillOpacity(opacity) {
    return this.prop('fill.opacity', draft.types.opacity(opacity));
  }
};

draft.defaults['fill.color'] = '#fff';
draft.defaults['fill.opacity'] = 1;
