// TODO: come up with a better location for methods
var methods = {};

var Draft = this.Draft = class Draft {
  constructor(element) {
    this.elements = {};
    this.children = [];

    if (element) {
      // Ensure the presence of a DOM element
      this.dom = typeof element == 'string' ?
        document.getElementById(element) :
        element;
    }
  }

  push(parent, child) {
    // Add a reference to the child's parent
    child.parent = parent;

    // Add the child to the end of the children array
    parent.children.push(child);

    // Add the child to its type array
    var type = elementType(child);
    this.elements[type] = this.elements[type] || [];
    this.elements[type].push(child);

    // Set the child's basic properties
    child.prop({
      type: type,
      id: elementID(child)
    });

    return child;
  }

  // This function takes an element and copies the supplied methods to it
  static extend(element, source) {
    if (typeof source === 'string') {
      Draft.extend(element, methods[source]);
    } else if (typeof source === 'object') {
      for (let key in source) {
        if (typeof source[key] === 'function') {
          element.prototype[key] = source[key];
        } else {
          Draft.extend(element, source[key]);
        }
      }
    }

    return source;
  }

  // Construct a unique ID from the element's type and ID
  static domID(element) {
    return 'DraftJS_' +
      element.properties.type + '_' +
      zeroPad(element.properties.id, 4);
  }
};
