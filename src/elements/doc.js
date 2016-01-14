Draft.Doc = class Doc extends Draft.Container {
  constructor(name) {
    super(name);

    // Initialize elements container
    this.elements = {};

    this.prop({
      system: Draft.defaults.system,
      units: Draft.defaults.units
    });
  }
};

Draft.doc = function(name) {
  return new Draft.Doc(name);
};

/* Draft.mixin(Draft, {
  doc(name) {
    return new Draft.Doc(name);
  }
}); */
