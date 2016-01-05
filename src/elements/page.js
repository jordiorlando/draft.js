Draft.Page = Draft.create({
  inherit: Draft.Group,

  methods: {
    // Set the page's origin relative to its (0, 0) position
    // TODO: remove this?
    origin: function (x, y) {
      return this.prop({
        'origin.x': x,
        'origin.y': y
      });
    }
  },

  init: {
    page: function (name) {
      // TODO: move this .prop call somewhere else?
      return this.add(new Draft.Page(name)).prop({
        system: Draft.defaults.system,
        units: Draft.defaults.units
      });

      // Draft.pages.push(page);
    }
  },

  parent: Draft.Doc
});
