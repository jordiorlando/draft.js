var draft = function(name) {
  return new draft.Doc(name);
};

draft.mixins = {};

// TODO:50 test safety checks for draft.px()
draft.px = function(val) {
  val = String(val);
  var num = parseFloat(val, 10);

  var regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;

  /* if (typeof units == 'string') {
    return new RegExp(`${regex.source}${units}$`, 'ig').test(val);
  } */

  // TODO: don't default to px?
  var units = regex.exec(val) === null ?
    false : val.slice(regex.lastIndex) || 'px';

  switch (units) {
    // Remain unchanged if units are already px
    case 'px':
      return num;

    // Points and picas (pt, pc)
    case 'pc':
      num *= 12;
      // Falls through
    case 'pt':
      num /= 72;
      break;

    // Metric units (mm, cm, dm, m, km)
    case 'km':
      num *= 1000;
      // Falls through
    case 'm':
      num *= 10;
      // Falls through
    case 'dm':
      num *= 10;
      // Falls through
    case 'cm':
      num *= 10;
      // Falls through
    case 'mm':
      num /= 25.4;
      break;

    // Imperial units (in, ft, yd, mi)
    case 'mi':
      num *= 1760;
      // Falls through
    case 'yd':
      num *= 3;
      // Falls through
    case 'ft':
      num *= 12;
      // Falls through
    case 'in':
      break;
    default:
      return undefined;
  }

  return num * draft.defaults.dpi;
};

// TODO:10 create an actual 'Unit' class for every unit instance
function unit(val) {
  return val == null ? val : `${val}_u`;
}
