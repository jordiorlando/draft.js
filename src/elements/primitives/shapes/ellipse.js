draft.Ellipse = draft.Shape.extend('Ellipse', {
  construct(width, height) {
    this.size(width || 75, height || 100);
  }
});



draft.EllipseSchema = draft.ShapeSchema.extendSchema('EllipseSchema', {
  schema: {
    size: {
      properties: {
        width: {
          default: 100
        },
        height: {
          default: 75
        }
      }
    }
  },
  methods: {
    diameter(dx, dy) {
      return this.size(dx, dy);
    },
    radius(rx, ry) {
      return this.size(rx * 2, ry * 2);
    }
  }
});
