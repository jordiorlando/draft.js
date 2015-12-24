Draw.Container = Draw.create({
  require: [
    // TODO: make Draw.tree into a separate plugin
    Draw.tree
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
