draft.Container = class Container extends draft.Element {
  constructor(name) {
    super();

    // Set a name if given
    this.prop('name', name || null);

    // Initialize children array
    this.children = [];
  }

  get name() {
    return this.prop('name');
  }

  /* child(child) {
    return this.children[child];
  } */

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

    // Add the child to the end of the children array
    this.children.push(child);

    // Fire the 'add' event to all listeners
    this.fire('add', [child]);

    return this;
  }

  push(child) {
    this.add(child);
    return child;
  }

  remove(child) {
    this.fire('remove', [child]);
    return this;
  }
};
