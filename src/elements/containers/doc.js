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

draft.doc = function doc(name) {
  var newDoc = new draft.Doc(name);

  (draft.docs || (draft.docs = [])).push(newDoc);
  newDoc._id = draft.docs.length;

  return newDoc;
};
