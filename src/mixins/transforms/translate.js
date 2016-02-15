draft.transforms.translate = {
  args: ['x', 'y', 'z'],
  transform(prop, val) {
    val = draft.types.length(val || 0);
    return draft.types.length((this.prop(prop) || 0) + val, this.unit());
  }
};

draft.transforms.position = {
  args: draft.transforms.translate.args,
  transform(prop, val) {
    return draft.types.length(val || 0, this.unit());
  }
};

draft.mixins.translate = {
  translate: draft.createTransform('translate'),
  position: draft.createTransform('position')
};
