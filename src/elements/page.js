Draft.Page = class Page extends Draft.Group {};

Draft.Page.require('size');

Draft.Doc.mixin({
  page(name) {
    return this.add(new Draft.Page(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
