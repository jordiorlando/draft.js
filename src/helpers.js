function zeroPad(number, length) {
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }

  return str;
}

function elementType(fun) {
  for (var element in Draw) {
    if (fun.constructor == Draw[element]) {
      return element.toLowerCase();
    }
  }
}
