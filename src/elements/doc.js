Draw.Doc = Draw.create({
  create: function (element) {
    if (element) {
      // Ensure the presence of a DOM element
      element = typeof element == 'string' ?
                document.getElementById(element) :
                element;

      this.node = element;
    }
  },

  inherit: Draw.Container,

  extend: {
    /*docs: function () {
      return this.node.docs;
    }*/
  }

  /*construct: {
    doc: function (element) {
      var doc = new Draw.Doc();

      if (element) {
        // Ensure the presence of a DOM element
        element = typeof element == 'string' ?
                  document.getElementById(element) :
                  element;

        doc.node = element;
      }

      return doc;
    }
  }*/
});
