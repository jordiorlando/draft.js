draft.Rectangle = draft.Shape.extend('Rectangle', {
  construct(width, height) {
    this.size(width || 75, height || 100);
  },
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
});

draft.Group.mixin({
  // TODO: rename to rectangle(name)
  rect(...args) {
    return this.rectangle(...args);
  }
});



draft.RectangleSchema = draft.ShapeSchema.extendSchema('RectangleSchema', {
  schema: {
    size: {
      properties: {
        width: {
          default: 75
        },
        height: {
          default: 100
        }
      }
    }
  },
  methods: {
    // Hehehe
    get rekt() {
      return `${Math.floor(Math.random() * 101)}% rekt`;
    }
  }
});
