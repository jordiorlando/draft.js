Draft.Element = Draft.create({
  require: [
    Draft.size,
    Draft.move
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});
