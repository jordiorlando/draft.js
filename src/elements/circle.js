Draw.Circle = Draw.create({
  inherit: Draw.Element,

  require: [
    Draw.move/*,
    Draw.radius*/
  ],

  methods: {
    radius: function (r) {
      return this.prop('r', r);
    }
  },

  init: {
    circle: function (r) {
      return this.put(new Draw.Circle()).radius(r);
    }
  }
});
