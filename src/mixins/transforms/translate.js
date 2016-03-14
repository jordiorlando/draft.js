draft.transforms.translate = {
  args: ['x', 'y', 'z'],
  transform(prop, val) {
    val = draft.newLength(val || 0);
    return draft.newLength((this.prop(prop) || 0) + val, this.unit());
  }
};

draft.transforms.position = {
  args: draft.transforms.translate.args,
  transform(prop, val) {
    return draft.newLength(val || 0, this.unit());
  }
};

draft.mixins.translate = {
  translate: draft.createTransform('translate'),
  position: draft.createTransform('position')
};
