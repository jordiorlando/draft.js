draft.transforms.scale = {
  args: ['width', 'height', 'length'],
  transform(prop, val) {
    val = parseFloat(val) || 1;
    return draft.newLength((this.prop(prop) || 0) * val, this.unit());
  }
};

draft.transforms.size = {
  args: draft.transforms.scale.args,
  transform(prop, val) {
    return draft.newLength(val || 0, this.unit());
  }
};

draft.mixins.scale = {
  scale: draft.createTransform('scale'),
  size: draft.createTransform('size')
};
