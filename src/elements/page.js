draft.Page = class Page extends draft.Group {};

draft.Page.require('size');

draft.Doc.mixin({
  page(name) {
    return this.add(new draft.Page(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
