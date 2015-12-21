Draw.Page = Draw.create({
  inherit: Draw.Group,

  require: [
    Draw.size
  ],

  methods: {
    origin: function (x, y) {
      // TODO: change to origin.x and origin.y?
      return this.attr({
        originX: x,
        originY: y
      });
    }
  },

  init: {
    page: function (name) {
      return this
        .put(new Draw.Page())
        .attr({
          type: 'page',
          name: name
        });

      // Draw.pages.push(page);
      // return page;
    }
  }
});
