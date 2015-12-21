Draw.Model = Draw.create({
  inherit: Draw.Group,

  extend: {
    origin: function (x, y, z) {
      // TODO: change to origin.x and origin.y?
      return this.attr({
        originX: x,
        originY: y,
        originZ: z
      });
    }
  },

  construct: {
    page: function (name) {
      return this
        .put(new Draw.Model())
        .attr({
          type: 'model',
          id: Draw.id++,
          name: name
        });
    }
  }
});
