Draw.Container = Draw.create({
  methods: {
    parent: function () {
      return this.parent;
    },
    child: function (i) {
      return this.children[i];
    },
    put: function (element) {
      element.parent = this;

      if (this.children == null) {
        this.children = [];
      }
      this.children.push(element);

      return element;
    }
  }
});
