Draft.Line = class Line extends Draft.Element {};

Draft.Container.mixin({
  line: function(x1, y1, x2, y2) {
    return this.add(new Draft.Line());
  }
});
