Draw.Model = Draw.create({
  inherit: Draw.Group,

  methods: {
    origin: function (x, y, z) {
      // TODO: change to origin.x and origin.y?
      return this.prop({
        originX: x,
        originY: y,
        originZ: z
      });
    }
  },

  init: {
    page: function (name) {
      return this
        .put(new Draw.Model())
        .prop({
          type: 'model',
          name: name
        });
    }
  }
});
