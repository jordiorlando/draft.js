Draw.Line = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move
  ],

  extend: {
  },

  construct: {
    line: function (x1, y1, x2, y2) {
      return new Draw.Line();
    }
  }
});
