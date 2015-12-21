Draw.Element = Draw.create({
  require: [
    Draw.attr,
    Draw.size
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});
