// Pad a number with zeroes until the number of digits is equal to length
function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

// Get the parent doc of an element
function elementDoc(element) {
  return elementType(element.parent) == 'doc' ?
    element.parent : elementDoc(element.parent);
}

// Get the type of an element
function elementType(element) {
  for (var e in Draft) {
    if (element.constructor == Draft[e]) {
      return e.toLowerCase();
    }
  }
}

// Get a unique ID based on the number of instances of a type of element
function elementID(element) {
  return elementDoc(element).elements[elementType(element)].length;
}

// Construct a unique ID from the element's type and ID
function domID(element) {
  return 'DraftJS_' +
    element.properties.type + '_' +
    zeroPad(element.properties.id, 4);
}

function updateDOM(element) {
  if (element.dom) {
    if (element.dom.tree) {
      element.updateTree();
    }
  }
  if (element.parent) {
    updateDOM(element.parent);
  }
}
