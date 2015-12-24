function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

function elementType(element) {
  for (var e in Draw) {
    if (element.constructor == Draw[e]) {
      return e.toLowerCase();
    }
  }
}

function elementID(element) {
  return Draw.prop.prop.call(element, 'type') +
    Draw.prop.prop.call(element, 'id');
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
