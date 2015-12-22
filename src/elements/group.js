Draw.Group = Draw.create({
  inherit: Draw.Container,

  require: [
    Draw.prop
  ],

  init: {
    group: function (name) {
      return this.put(new Draw.Group(name));
    }
  }
});
