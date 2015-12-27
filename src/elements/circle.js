Draft.Circle = Draft.create({
  inherit: Draft.Element,

  require: [
    /*Draft.radius*/
  ],

  methods: {
    radius: function (r) {
      return this.prop('r', r);
    }
  },

  init: {
    circle: function (r) {
      return this.add(new Draft.Circle()).radius(r);
    }
  }
});
