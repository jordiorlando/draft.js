Draft.Page = Draft.create({
  inherit: Draft.Group,

  require: [
    Draft.size
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
      return this.put(new Draft.Page(name));

      // Draft.pages.push(page);
    }
  }
});
