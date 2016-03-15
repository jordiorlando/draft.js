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
      type: 'object',
      order: ['x', 'y'],
      alias: ['pos'],
      properties: {
        x: {
          type: 'length',
          default: 0
        },
        y: {
          type: 'length',
          default: 0
        }
      }
    },
    stroke: {
      type: 'object',
      order: ['color', 'opacity', 'width'],
      properties: {
        color: {
          type: 'color',
          default: '#000'
        },
        opacity: {
          type: 'float',
          min: 0,
          max: 1,
          default: 1
        },
        width: {
          type: 'length',
          default: 1
        }
      }
    }
  }
});
