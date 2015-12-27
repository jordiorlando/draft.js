Draft.Doc = Draft.create({
  construct: function (element) {
    if (element) {
      // Ensure the presence of a DOM element
      this.dom = typeof element == 'string' ?
        document.getElementById(element) :
        element;
    }
  },

  inherit: Draft.Container

  /*methods: {
    docs: function () {
      return this.node.docs;
    }
  }*/

  /*init: {
    doc: function (element, name) {
      if (element) {
        // Ensure the presence of a DOM element
        element = typeof element == 'string' ?
          document.getElementById(element) :
          element;

        var doc = new Draft.Doc(name);

        // this.node = {};
        doc.children = [];
        doc.dom = element;

        return doc;
      }

      // this.constructor.call(this, element);
    }
  }*/
});
