Draft.Line = Draft.create({
  inherit: Draft.Element,

  methods: {
  },

  init: {
    line: function (x1, y1, x2, y2) {
      return this.add(new Draft.Line());
    }
  }
});
