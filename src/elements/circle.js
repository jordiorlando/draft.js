Draw.Circle = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  extend: {
  },

  construct: {
    circle: function (r) {
      return this.put(new Draw.Circle()).radius(r);
    }
  }
});
