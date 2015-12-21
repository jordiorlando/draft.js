Draw.Rect = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  extend: {
    // in the butt
    getRekt: function () {
      return this.attr();
    }
  },

  construct: {
    rect: function (width, height) {
      return this.put(new Draw.Rect()).size(width, height);
    }
  }
});
