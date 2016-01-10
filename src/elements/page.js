Draft.Page = class Page extends Draft.Group {
  // BACKLOG:40 remove page.origin?
  // Set the page's origin relative to its (0, 0) position
  origin(x, y) {
    return this.prop({
      'origin.x': Draft.px(x),
      'origin.y': Draft.px(y)
    });
  }
};

Draft.Page.require('size');

Draft.Doc.mixin({
  page: function(name) {
    return this.add(new Draft.Page(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
