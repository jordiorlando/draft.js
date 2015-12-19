Draw.Line = function () {
  Draw.inherit.call(this, Draw.size);
  Draw.inherit.call(this, Draw.move);
  Draw.inherit.call(this, Draw.transforms);

  return this;
};

Draw.line = function (x1, y1, x2, y2) {
  var line = new Draw.Line();
  return line;
};
