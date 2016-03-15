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
      alpha: {
        type: draft.Angle,
        value: 0,
        alias: ['α', 'angle']
      }
    },
    size: {
      length: {
        type: draft.Length,
        value: 100,
        alias: ['l']
      }
    }
  }
});
