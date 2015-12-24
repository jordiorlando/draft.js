Draft.Element = Draft.create({
  require: [
    Draft.prop,
    Draft.size
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});
