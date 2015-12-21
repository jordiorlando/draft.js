Draw.Element = Draw.create({
  require: [
    Draw.attr,
    Draw.size
  ],

  extend: {
    parent: function () {
      return this.node.parent;
    }
  }
});
