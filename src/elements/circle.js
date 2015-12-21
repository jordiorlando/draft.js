Draw.Circle = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  init: {
    circle: function (r) {
      return this.put(new Draw.Circle()).radius(r);
    }
  }
});
