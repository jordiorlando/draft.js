draft.Doc = class Doc extends draft.Container {
  constructor(name) {
    super(name);

    // Initialize elements container
    this.elements = {};

    this.prop({
      system: draft.defaults.system,
      units: draft.defaults.units
    });
  }
};

/* draft.doc = function(name) {
  return new draft.Doc(name);
}; */

/* draft.mixin(draft, {
  doc(name) {
    return new draft.Doc(name);
  }
}); */
