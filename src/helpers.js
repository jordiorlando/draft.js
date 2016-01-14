// TODO:10 create an actual 'Unit' class for every unit instance
function unit(val) {
  return val == null ? val : `${val}_u`;
}

function testUnits(val, units) {
  var regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;
  val = String(val);

  if (typeof units == 'string') {
    return new RegExp(`${regex.source}${units}$`, 'ig').test(val);
  }

  // TODO: don't default to px?
  return regex.exec(val) === null ?
    false : val.slice(regex.lastIndex) || 'px';
}

// BACKLOG: use Proxy to create a clean element tree (ignore all parent keys)
