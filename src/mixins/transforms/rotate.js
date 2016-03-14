draft.transforms.rotate = {
  args: ['alpha', 'beta', 'gamma', 'order'],
  transform(prop, val) {
    val = draft.angle(val || 0);
    return draft.angle((this.prop(prop) || 0) + val, this.defaults.angle);
  }
};

draft.transforms.orientation = {
  args: draft.transforms.rotate.args,
  transform(prop, currVal, val) {
    return draft.angle(val || 0, this.defaults.angle);
  }
};

draft.mixins.rotate = {
  rotate: draft.createTransform('rotate'),
  orientation: draft.createTransform('orientation')
};
