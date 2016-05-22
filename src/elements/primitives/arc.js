draft.Arc = draft.PointSchema.extendSchema('Arc', {
  schema: {
    size: {
      type: 'object',
      properties: {
        radius: {
          type: 'length',
          alias: ['r'],
          default: 50
        }
      }
    },
    angle: {
      type: 'angle',
      alias: ['θ', 'theta'],
      default: 90
    }
  }
});
