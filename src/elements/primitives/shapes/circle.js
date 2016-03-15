draft.Circle = draft.Ellipse.extend('Circle', {
  construct(width) {
    this.size(width || 100);
  },
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  },
  radius(r) {
    return this.size(r * 2, r * 2);
  }
});


draft.CircleSchema = draft.EllipseSchema.extendSchema('CircleSchema', {
  schema: {
    size: {
      properties: {
        height: null
      }
    }
  },
  methods: {
    diameter(d) {
      return this.size(d);
    },
    radius(r) {
      return this.size(r * 2);
    }
  }
});
