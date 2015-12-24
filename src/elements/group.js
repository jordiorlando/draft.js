Draft.Group = Draft.create({
  inherit: Draft.Container,

  require: [
    Draft.prop
  ],

  init: {
    group: function (name) {
      return this.put(new Draft.Group(name));
    }
  }
});
