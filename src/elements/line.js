Draw.Line = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move
  ],

  methods: {
  },

  init: {
    line: function (x1, y1, x2, y2) {
      return new Draw.Line();
    }
  }
});
