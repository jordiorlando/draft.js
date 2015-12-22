Draw.Rect = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  methods: {
    // in the butt
    getRekt: function () {
      return this.prop();
    }
  },

  init: {
    rect: function (width, height) {
      return this.put(new Draw.Rect()).size(width, height);
    }
  }
});
