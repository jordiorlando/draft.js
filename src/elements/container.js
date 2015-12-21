Draw.Container = Draw.create({
  extend: {
    parent: function () {
      return this.node.parent;
    },
    child: function (i) {
      return this.node.children[i];
    },
    children: function () {
      return this.node.children;
    },
    put: function (element) {
      element.node.parent = this;
      this.node.children.push(element);
      return element;
    }
  }
});
