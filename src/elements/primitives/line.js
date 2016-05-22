draft.Line = class Line extends draft.Point {
  get map() {
    // TODO: remove angles from element properties
    return super.map.concat(...['alpha', 'width']);
  }
};

// TODO: skew transformation?
draft.Line.mixin([
  'rotate',
  'scale'
]);

draft.Group.mixin({
  line(name) {
    return this.append(new draft.Line(name)).size(100);
  }
});



draft.LineSchema = draft.PointSchema.extendSchema('LineSchema', {
  schema: {
    rotation: {
      type: 'object',
      alias: ['rot'],
      properties: {
        alpha: {
          type: 'angle',
          alias: ['α', 'angle'],
          default: 0
        }
      }
    },
    size: {
      type: 'object',
      properties: {
        length: {
          type: 'length',
          alias: ['l'],
          default: 100
        }
      }
    }
  }
});
