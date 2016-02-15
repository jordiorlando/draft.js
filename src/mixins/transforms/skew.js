draft.transforms.skew = {
  args: ['skewX', 'skewY', 'skewZ'],
  transform(prop, val) {
    return parseFloat(val) || 0;
  }
};

draft.mixins.skew = {
  skew: draft.createTransform('skew')
};
