Draft.Group = Draft.create({
  inherit: Draft.Container,

  require: [
    Draft.system,
    Draft.units
  ],

  init: {
    group: function (name) {
      // TODO: move this .prop call somewhere else?
      return this.add(new Draft.Group(name)).prop({
        system: this.system(),
        units: this.units()
      }).move(0, 0);
    }
  }
});
