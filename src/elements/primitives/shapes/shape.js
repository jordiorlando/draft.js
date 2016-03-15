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
      order: ['width', 'height'],
      properties: {
        length: null,
        width: {
          type: 'length',
          alias: ['w']
        },
        height: {
          type: 'length',
          alias: ['h']
        }
      }
    },
    fill: {
      type: 'object',
      order: ['color', 'opacity'],
      properties: {
        color: {
          type: 'color',
          default: '#fff'
        },
        opacity: {
          type: 'float',
          min: 0,
          max: 1,
          default: 1
        }
      }
    }
  }
});
