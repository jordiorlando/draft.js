Draft.Container = Draft.create({
  // TODO: inherit from Draft.Element?
  require: [
    Draft.prop,
    // TODO: make Draft.tree into a separate plugin
    Draft.tree
  ],

  methods: {
    parent: function () {
      return this.parent;
    },
    child: function (child) {
      return this.children[child];
    },
    push: function (element) {
      // Add a reference to the element's parent
      element.parent = this;

      // Initialize children array and add the element to the end
      this.children = this.children || [];
      this.children.push(element);

      // Add the element to its type array
      var doc = elementDoc(element);
      var type = elementType(element);
      doc.elements = doc.elements || {};
      doc.elements[type] = doc.elements[type] || [];
      doc.elements[type].push(element);

      // Set the element's basic properties
      element.prop({
        type: type,
        id: elementID(element)
      });

      return element;
    },
    // FIXME: figure out why this only updates the tree when saved to a var
    add: function (element) {
      return this.push(element);
    }
  }
});
