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
    return elementDoc(this).push(this, element);
  }
};

// Draft.extend(Draft, Draft.Container);
