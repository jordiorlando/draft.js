Draft.Container = Draft.create({
  require: [
    // TODO: make Draft.tree into a separate plugin
    Draft.tree
  ],

  methods: {
    parent: function () {
      return this.parent;
    },
    child: function (i) {
      return this.children[i];
    },
    put: function (element) {
      element.parent = this;

      this.children = this.children || [];
      this.children.push(element);

      return element;
    }
  }
});
