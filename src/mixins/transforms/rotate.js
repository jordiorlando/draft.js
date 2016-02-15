draft.transforms.rotate = {
  args: ['alpha', 'beta', 'gamma', 'order'],
  transform(prop, val) {
    val = draft.types.angle(val || 0);
    return draft.types.angle((this.prop(prop) || 0) + val, this.defaults.angle);
  }
};

draft.transforms.orientation = {
  args: draft.transforms.rotate.args,
  transform(prop, currVal, val) {
    return draft.types.angle(val || 0, this.defaults.angle);
  }
};

draft.mixins.rotate = {
  rotate: draft.createTransform('rotate'),
  orientation: draft.createTransform('orientation')
};
