function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

function elementType(element) {
  for (var e in Draft) {
    if (element.constructor == Draft[e]) {
      return e.toLowerCase();
    }
  }
}

function elementID(element) {
  return Draft.prop.prop.call(element, 'type') +
    Draft.prop.prop.call(element, 'id');
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
