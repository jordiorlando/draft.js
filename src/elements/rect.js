Draw.Rect = Draw.create({
  name: 'rect',

  inherit: Draw.Element,

  require: [
    Draw.move,
    Draw.radius
  ],

  methods: {
    // in the butt
    getRekt: function () {
      return this.attr();
    }
  },

  init: {
    rect: function (width, height) {
      return this.put(new Draw.Rect()).size(width, height);
    }
  }
});
