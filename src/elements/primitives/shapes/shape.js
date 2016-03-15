draft.Shape = draft.Line.extend('Shape', {
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width', 'height',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  }
});

draft.Shape.mixin([
  'skew',
  'fill'
]);



draft.ShapeSchema = draft.LineSchema.extendSchema('ShapeSchema', {
  schema: {
    size: {
      length: null,
      width: {
        type: draft.Length,
        alias: ['w']
      },
      height: {
        type: draft.Length,
        alias: ['h']
      }
    },
    fill: {
      color: {
        type: draft.Color,
        value: '#fff'
      },
      opacity: {
        type: draft.Float,
        min: 0.0,
        max: 1.0,
        value: 1.0
      }
    }
  }
});
