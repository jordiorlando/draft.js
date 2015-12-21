Draw.Doc = Draw.create({
  construct: function (element) {
    if (element) {
      // Ensure the presence of a DOM element
      element = typeof element == 'string' ?
                document.getElementById(element) :
                element;

      // this.node = {};
      this.children = [];
      this.dom = element;
    }
  },

  inherit: Draw.Container,

  /*methods: {
    docs: function () {
      return this.node.docs;
    }
  }*/

  init: {
    doc: function (element) {
      this.constructor.call(this, element);
    }
  }
});
