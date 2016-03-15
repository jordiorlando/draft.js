draft.Point = class Point extends draft.Element {
  get map() {
    // TODO: remove xyz from element properties
    return ['x', 'y', 'z', 'stroke'];
  }
};

draft.Point.mixin([
  'translate',
  'stroke'
]);

draft.Group.mixin({
  point(name) {
    return this.append(new draft.Point(name));
  }
});



draft.PointSchema = draft.Element.extendSchema('PointSchema', {
  schema: {
    position: {
      alias: ['pos'],
      x: {
        type: draft.Length,
        value: 0
      },
      y: {
        type: draft.Length,
        value: 0
      }
    },
    stroke: {
      color: {
        type: draft.Color,
        value: '#000'
      },
      opacity: {
        type: draft.Float,
        min: 0.0,
        max: 1.0,
        value: 1.0
      },
      width: {
        type: draft.Length,
        value: 1
      }
    }
  }
});
