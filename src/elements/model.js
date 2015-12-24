Draft.Model = Draft.create({
  inherit: Draft.Group,

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
        .put(new Draft.Model())
        .prop({
          type: 'model',
          name: name
        });
    }
  }
});
