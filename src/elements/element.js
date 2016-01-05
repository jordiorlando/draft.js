Draft.Element = Draft.create({
  require: [
    Draft.prop,
    Draft.size,
    Draft.move
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});
