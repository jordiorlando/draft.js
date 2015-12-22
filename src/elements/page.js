Draw.Page = Draw.create({
  inherit: Draw.Group,

  require: [
    Draw.size
  ],

  methods: {
    origin: function (x, y) {
      // TODO: change to origin.x and origin.y?
      return this.prop({
        originX: x,
        originY: y
      });
    }
  },

  init: {
    page: function (name) {
      return this.put(new Draw.Page(name));

      // Draw.pages.push(page);
    }
  }
});
