Draft.Rect = Draft.create({
  inherit: Draft.Element,

  require: [
    Draft.radius
  ],

  methods: {
    // in the butt
    getRekt: function () {
      return this.prop();
    }
  },

  init: {
    rect: function (width, height) {
      return this.add(new Draft.Rect()).size(width, height);
    }
  }
});
