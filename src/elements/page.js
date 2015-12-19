Draw.Page = function () {
  Draw.inherit.call(this, Draw.size);

  this.origin = function (x, y) {
    // TODO: change to origin.x and origin.y?
    return this.attr({
      originX: x,
      originY: y
    });
  };

  return this;
};

Draw.page = function (name) {
  var page = new Draw.Page()
    .attr('type', 'page')
    .attr('id', Draw.id++)
    .attr('name', name);

  Draw.pages.push(page);
  return page;
};
