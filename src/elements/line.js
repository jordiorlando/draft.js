Draft.Line = Draft.create({
  inherit: Draft.Element,

  require: [
    Draft.move
  ],

  methods: {
  },

  init: {
    line: function (x1, y1, x2, y2) {
      return new Draft.Line();
    }
  }
});
