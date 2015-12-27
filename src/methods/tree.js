Draft.tree = {
  require: [
    Draft.json
  ],

  createTree: function () {
    var tree = document.createElement('div');
    tree.className = 'element-tree';

    // tree.appendChild(document.createElement('span'));
    // tree.firstChild.textContent = 'Document Model:';

    var pre = document.createElement('pre');
    tree.appendChild(pre);

    // Make sure this.dom is initialized
    this.dom = this.dom || {};
    this.dom.tree = tree;

    return this.updateTree();
  },

  updateTree: function () {
    var replacer = function (key, value) {
      if (key == "dom" || key == "parent" || key == "id" || key == "type") {
        return undefined;
      } else if (key == "children") {
        var obj = {};
        value.forEach(function (element) {
          obj[domID(element)] = element;
        });
        return obj;
      }
      return value;
    };

    var treeString = this.stringify(replacer).split('"').join('');
    this.dom.tree.firstChild.textContent = domID(this) + ': ' + treeString;

    var longestLine = treeString.split('\n').reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });
    // FIXME: change 84 to a non-hardcoded value
    this.dom.tree.style.width = Math.min(longestLine.length + 4, 84) + 'ch';

    return this.dom.tree;
  }
};
