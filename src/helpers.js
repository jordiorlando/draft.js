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

function testUnits(val, units) {
  let regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;
  val = String(val);

  if (typeof units == 'string') {
    return new RegExp(regex.source + units + '$', 'ig').test(val);
  } else {
    // TODO: don't default to px?
    return regex.exec(val) !== null ?
      val.slice(regex.lastIndex) || 'px' : false;
  }
}

// BACKLOG: use Proxy to create a clean element tree (e.g. ignore all parent keys)
