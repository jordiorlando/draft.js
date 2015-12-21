Draw.Group = Draw.create({
  inherit: Draw.Container,

  require: [
    Draw.attr
  ],

  init: {
    group: function (name) {
      return this
        .put(new Draw.Group())
        .attr({
          type: 'group',
          name: name
        });
    }
  }
});
