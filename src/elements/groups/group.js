draft.Group = class Group extends draft.Element {
  constructor(name) {
    super(name);

    // Initialize children array
    this.children = [];
  }

  get firstChild() {
    return this.children[0];
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  add(child) {
    // Add a reference to the child's parent and containing doc
    child.parent = this;
    child.doc = this.doc || this;

    // Add the child to its type array
    var type = child.type;
    (child.doc.elements[type] || (child.doc.elements[type] = [])).push(child);
    // Set the child's id
    child._id = child.doc.elements[type].length;
    // _id.set(child, child.doc.elements[type].length);

    // Add the child to the end of the children array
    this.children.push(child);

    // Fire the 'add' event to all listeners
    this.fire('add', child);

    return this;
  }

  append(child) {
    this.add(child);
    return child;
  }

  remove(child) {
    this.fire('remove', child);
    return this;
  }
};

draft.Group.mixin([
  'system',
  'units'
]);

draft.Group.mixin({
  group(name) {
    return this.append(new draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
