Draft.Container = class Container extends Draft.Element {
  constructor() {
    super();

    // Initialize children array
    this.children = [];
  }

  child(child) {
    return this.children[child];
  }

  add(element) {
    return this.doc.push(this, element);
  }
};

// Draft.extend(Draft, Draft.Container);
