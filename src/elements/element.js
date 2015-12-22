Draw.Element = Draw.create({
  require: [
    Draw.prop,
    Draw.size
  ],

  methods: {
    parent: function () {
      return this.parent;
    }
  }
});
