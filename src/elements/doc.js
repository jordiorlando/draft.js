Draft.Doc = class Doc extends Draft.Container {
  constructor(name) {
    super(name);

    // Initialize elements container
    this.elements = {};

    this.prop({
      system: defaults.system,
      units: defaults.units
    });
  }
};

Draft.doc = function(name) {
  return new Draft.Doc(name);
};

/*Draft.mixin(Draft, {
  doc: function(name) {
    return new Draft.Doc(name);
  }
});*/
