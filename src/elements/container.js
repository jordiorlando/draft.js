Draft.Container = class Container extends Draft.Element {
  constructor(name) {
    super();

    // Set a name if given
    this.prop('name', name || null);

    // Initialize children array
    this.children = [];
  }

  /*child(child) {
  get name() {
    return this.prop('name');
  }

    return this.children[child];
  }*/

  push(child) {
    // Add a reference to the child's parent and containing doc
    child.parent = this;
    child.doc = this.doc || this;

    this.dom.node.appendChild(child.dom.node);

    // Add the child to its type array
    var type = child.type;
    child.doc.elements[type] = child.doc.elements[type] || [];
    child.doc.elements[type].push(child);
    // Set the child's basic properties
    child.prop('id', child.doc.elements[child.type].length);

    // Add the child to the end of the children array
    this.children.push(child);

    return this;
  }

  add(child) {
    this.push(child);
    return child;
  }
};
