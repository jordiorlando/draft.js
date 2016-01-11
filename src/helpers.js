// Pad a number with zeroes until the number of digits is equal to length
function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

// HACK:0 need a better way of getting an element's type
// Get the type of an element
function elementType(element) {
  for (var type in Draft) {
    if (element.constructor == Draft[type]) {
      return type.toLowerCase();
    }
  }
}

// Get a unique ID based on the number of instances of a type of element
function elementID(element) {
  return element.doc.elements[element.prop('type')].length;
}

// TODO:10 create an actual 'Unit' class for every unit instance
function unit(val) {
  return val == null ? val : val + '_u';
}
